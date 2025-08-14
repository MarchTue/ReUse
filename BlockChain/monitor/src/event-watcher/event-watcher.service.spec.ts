import { Test, TestingModule } from '@nestjs/testing';
import { EventWatcherService } from './event-watcher.service';

describe('EventWatcherService', () => {
  let service: EventWatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventWatcherService],
    }).compile();

    service = module.get<EventWatcherService>(EventWatcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
