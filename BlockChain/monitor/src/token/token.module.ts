import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { EthModule } from '../eth/eth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MetricsModule } from '../metrics/metrics.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EthModule, PrismaModule, MetricsModule, ConfigModule],
  providers: [TokenService],
})
export class TokenModule { }
