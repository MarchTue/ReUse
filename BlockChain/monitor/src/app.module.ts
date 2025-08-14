import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventWatcherModule } from './event-watcher/event-watcher.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EventWatcherModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
