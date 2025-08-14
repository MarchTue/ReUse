import { Test, TestingModule } from '@nestjs/testing';
import { Eth } from './eth';

describe('Eth', () => {
  let provider: Eth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Eth],
    }).compile();

    provider = module.get<Eth>(Eth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
