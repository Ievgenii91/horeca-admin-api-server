import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  TimeTracking,
  TimeTrackingDocument,
} from 'src/schemas/timetracking.schema';
import { CreateTimetrackingDto } from './dto/create-timetracking.dto';
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

  findAll() {
    return this.timeTrackingModel.find().exec();
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
