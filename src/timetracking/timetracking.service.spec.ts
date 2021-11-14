import { Test, TestingModule } from '@nestjs/testing';
import { TimetrackingService } from './timetracking.service';

describe('TimetrackingService', () => {
  let service: TimetrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimetrackingService],
    }).compile();

    service = module.get<TimetrackingService>(TimetrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
