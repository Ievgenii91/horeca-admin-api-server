import { Module } from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { TimetrackingController } from './timetracking.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  TimeTracking,
  TimeTrackingSchema,
} from 'src/schemas/timetracking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TimeTracking.name,
        schema: TimeTrackingSchema,
      },
    ]),
  ],
  controllers: [TimetrackingController],
  providers: [TimetrackingService],
})
export class TimetrackingModule {}
