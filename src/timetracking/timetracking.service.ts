import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TimeTracking,
  TimeTrackingDocument,
} from 'src/schemas/timetracking.schema';
import { CreateTimetrackingDto } from './dto/create-timetracking.dto';
import { SearchTimetrackingDto } from './dto/search-timetracking.dto';
import { UpdateTimetrackingDto } from './dto/update-timetracking.dto';

@Injectable()
export class TimetrackingService {
  constructor(
    @InjectModel(TimeTracking.name)
    private timeTrackingModel: Model<TimeTrackingDocument>,
  ) {}

  create(createTimetrackingDto: CreateTimetrackingDto) {
    const timeTracking = new this.timeTrackingModel(createTimetrackingDto);
    return timeTracking.save();
  }

  findAll(filter: SearchTimetrackingDto) {
    console.log(
      new Date(new Date(filter.startDate).setUTCHours(0, 0, 1)).toISOString(),
      new Date(new Date(filter.endDate).setUTCHours(23, 59, 59)).toISOString(),
    );
    return this.timeTrackingModel
      .find({
        clientId: filter.clientId,
        startDate: {
          $gte: new Date(
            new Date(filter.startDate).setUTCHours(0, 0, 1),
          ).toISOString(),
        },
        endDate: {
          $lte: new Date(
            new Date(filter.endDate).setUTCHours(23, 59, 59),
          ).toISOString(),
        },
      } as any)
      .exec();
  }

  findOne(_id: string) {
    return this.timeTrackingModel.find({ _id }).exec();
  }

  update(_id: string, updateTimetrackingDto: UpdateTimetrackingDto) {
    return this.timeTrackingModel
      .findOneAndUpdate({ _id }, { $set: updateTimetrackingDto })
      .exec();
  }

  remove(_id: string) {
    return this.timeTrackingModel.deleteOne({ _id }).exec();
  }
}
