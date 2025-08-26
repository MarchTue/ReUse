import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Gauge, Registry } from 'prom-client';

@Injectable()
export class MetricsService {
  private registry = new Registry();

  private eventCounter: Counter<string>;
  private balanceGauge: Gauge<string>;

  constructor() {
    collectDefaultMetrics({ register: this.registry });
    this.eventCounter = new Counter({
      name: 'monitor_event_total',
      help: "Total monitored events",
      labelNames: ['event', 'contract'] as const,
      registers: [this.registry]
    });
    this.balanceGauge = new Gauge({
      name: 'holder_balance',
      help: "Monitored holder balance",
      labelNames: ['holder', 'token'] as const,
      registers: [this.registry]
    });
  }

  countEvent(name: string, contract: string) {
    this.eventCounter.labels(name, contract).inc();
  }

  setHolderBalance(holder: string, token: string, value: number) {
    this.balanceGauge.labels(holder, token).set(value);
  }

  async metrics(): Promise<string> {
    return await this.registry.metrics();
  }

}
