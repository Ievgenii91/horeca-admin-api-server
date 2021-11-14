import { Test, TestingModule } from '@nestjs/testing';
import { TimetrackingController } from './timetracking.controller';
import { TimetrackingService } from './timetracking.service';

describe('TimetrackingController', () => {
  let controller: TimetrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimetrackingController],
      providers: [TimetrackingService],
    }).compile();

    controller = module.get<TimetrackingController>(TimetrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
