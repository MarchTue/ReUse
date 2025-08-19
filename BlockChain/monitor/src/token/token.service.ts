import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MetricsService } from '../metrics/metrics.service';
import { Contract, Interface } from 'ethers';
import { ConfigService } from '@nestjs/config';
import { TOKEN_ABI } from './token.abi';
import { Eth } from 'src/eth/eth';

@Injectable()
export class TokenService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TokenService.name);
  private pollTimer?: NodeJS.Timeout;
  private contract?: Contract;
  private decimals = 18;

  constructor(
    private eth: Eth,
    private prisma: PrismaService,
    private metrics: MetricsService,
    private cfg: ConfigService,
  ) {}

  async onModuleInit() {
    // find token row named "MyToken"
    const tokenRow = await this.prisma.monitoredContract.findFirst({ where: { name: 'MyToken' }});
    if (!tokenRow) {
      this.logger.warn('No MyToken registered. Skipping token monitor.');
      return;
    }
    this.contract = new Contract(tokenRow.address, TOKEN_ABI, this.eth.wsProvider);
    try { this.decimals = Number(await this.contract.decimals()); } catch {}

    // poll balances
    const interval = Number(process.env.POLL_INTERVAL_SEC ?? 30) * 1000;
    this.pollTimer = setInterval(() => this.poll(tokenRow.address), interval);
    this.logger.log(`Token poll every ${interval/1000}s`);
  }

  async onModuleDestroy() {
    if (this.pollTimer) clearInterval(this.pollTimer);
  }

  private async poll(tokenAddress: string) {
    try {
      const holders = (process.env.POLL_ADDRESSES ?? '').split(',').map(s => s.trim()).filter(Boolean);
      const blockNumber = await this.eth.wsProvider.getBlockNumber();
      for (const holder of holders) {
        const bal = await this.contract!.balanceOf(holder);
        await this.prisma.balanceSnapshot.create({
          data: {
            tokenAddress,
            holder,
            balance: bal.toString(),
            blockNumber,
          }
        });
        const human = Number(bal) / (10 ** this.decimals);
        this.metrics.setHolderBalance(holder, tokenAddress, human);
        this.logger.log(`[balance] ${holder}=${human}`);
      }
    } catch (e) {
      this.logger.error(`poll error: ${String(e)}`);
    }
  }
}
