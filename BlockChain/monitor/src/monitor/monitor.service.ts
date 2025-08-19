import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { EventsGateway } from '../events/events.gateway';
import { Interface, Log, Contract } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { Eth } from 'src/eth/eth';

@Injectable()
export class MonitorService implements OnModuleInit {
  private readonly logger = new Logger(MonitorService.name);

  constructor(
    private eth: Eth,
    private prisma: PrismaService,
    private metrics: MetricsService,
    private gateway: EventsGateway,
  ) { }

  async onModuleInit() {
    const monitors = await this.prisma.monitoredContract.findMany();
    if (!monitors.length) {
      this.logger.warn('MonitoredContract table empty. seed some rows.');
      return;
    }

    const provider = this.eth.wsProvider;

    for (const m of monitors) {
      try {
        const abiPath = path.resolve(m.abiPath);
        const abiRaw = fs.readFileSync(abiPath, 'utf8');
        const abi = JSON.parse(abiRaw);
        const iface = new Interface(abi);
        const contract = new Contract(m.address, abi, provider);

        const kvKey = `last_block_${m.address.toLowerCase()}`;
        const kv = await this.prisma.kvStore.findUnique({ where: { key: kvKey } });
        const fromBlock = kv ? Number(kv.value) + 1 : 0;
        const current = await provider.getBlockNumber();
        this.logger.log(`[${m.name}] backfill ${fromBlock}→${current}`);

        if (current >= fromBlock) {
          const logs = await provider.getLogs({ fromBlock, toBlock: current, address: m.address });
          await this.handleLogs(m, logs, iface);
          await this.prisma.kvStore.upsert({
            where: { key: kvKey },
            update: { value: String(current) },
            create: { key: kvKey, value: String(current) },
          });
        }

        // live subscribe
        provider.on({ address: m.address }, async (log: Log) => {
          await this.handleLogs(m, [log], iface);
          await this.prisma.kvStore.upsert({
            where: { key: kvKey },
            update: { value: String(log.blockNumber) },
            create: { key: kvKey, value: String(log.blockNumber) },
          });
        });

        this.logger.log(`[${m.name}] subscribed @ ${m.address}`);
      } catch (e) {
        this.logger.error(`Monitor init error for ${m.address}: ${String(e)}`);
      }
    }
  }

  private async handleLogs(m: any, logs: Log[], iface: Interface) {
    for (const lg of logs) {
      try {
        const parsed = iface.parseLog(lg);
        const argsObj: any = {};
        for (const k in parsed.args) {
          const v = parsed.args[k];
          if (typeof v === 'bigint') argsObj[k] = v.toString();
          else argsObj[k] = v;
        }

        await this.prisma.eventLog.create({
          data: {
            contractId: m.id,
            eventName: parsed.name,
            txHash: lg.transactionHash,
            blockNumber: lg.blockNumber,
            logIndex: lg.index,
            dataJson: JSON.stringify(argsObj),
          },
        });

        this.metrics.countEvent(parsed.name, m.name);
        this.gateway.broadcast('monitor:event', { contract: m.name, event: parsed.name, args: argsObj });

        this.logger.log(`[${m.name}] ${parsed.name} #${lg.blockNumber}`);
      } catch (e) {
        this.logger.warn(`parse failed @${lg.blockNumber}: ${String(e)}`);
      }
    }
  }
}
