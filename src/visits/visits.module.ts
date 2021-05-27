import { Module } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from './entities/visit.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Visit.name,
        schema: VisitSchema,
      },
    ]),
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
