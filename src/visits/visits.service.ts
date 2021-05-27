import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateVisitDto } from './dto/create-visit.dto';
import { GetVisitsDto } from './dto/get-visits.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { Visit, VisitDocument } from './entities/visit.schema';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<VisitDocument>,
  ) {}

  create(createVisitDto: CreateVisitDto) {
    return 'This action adds a new visit';
  }

  async findAll(filter: GetVisitsDto) {
    let query = { ...filter } as GetVisitsDto & { date: unknown };
    if (filter.startDate && filter.endDate) {
      query = {
        ...query,
        date: {
          $gte: new Date(
            new Date(filter.startDate).setHours(0, 0, 1),
          ).toISOString(),
          $lte: new Date(
            new Date(filter.endDate).setHours(23, 59, 59),
          ).toISOString(),
        },
      };
      delete query.startDate;
      delete query.endDate;
    }
    return this.visitModel.find(query).sort({ date: 1 }).exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} visit`;
  }

  update(id: number, updateVisitDto: UpdateVisitDto) {
    return `This action updates a #${id} visit`;
  }

  remove(id: number) {
    return `This action removes a #${id} visit`;
  }
}
