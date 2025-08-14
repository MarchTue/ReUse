import { Module } from '@nestjs/common';
import { Eth } from './eth';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [Eth, ConfigService],
  exports: [Eth]
})
export class EthModule { }
