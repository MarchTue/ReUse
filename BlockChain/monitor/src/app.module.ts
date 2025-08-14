import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventWatcherModule } from './event-watcher/event-watcher.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigService } from './config/config.service';
import { EthModule } from './eth/eth.module';

@Module({
  imports: [EventWatcherModule, PrismaModule, EthModule],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
