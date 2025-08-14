import { Module } from '@nestjs/common';
import { EventWatcherService } from './event-watcher.service';

@Module({
  providers: [EventWatcherService]
})
export class EventWatcherModule {}
