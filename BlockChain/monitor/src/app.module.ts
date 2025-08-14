import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigService } from './config/config.service';
import { EthModule } from './eth/eth.module';
import { EventsModule } from './events/events.module';
import { MetricsModule } from './metrics/metrics.module';
import { MetricController } from './metric/metric.controller';

@Module({
  imports: [PrismaModule, EthModule, EventsModule, MetricsModule],
  controllers: [AppController, MetricController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
