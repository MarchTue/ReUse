import { Module } from '@nestjs/common';
import { MonitorService } from './monitor.service';
import { EthModule } from '../eth/eth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [EthModule, PrismaModule, MetricsModule, EventsModule],
  providers: [MonitorService],
})
export class MonitorModule { }
