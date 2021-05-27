import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { GetVisitsDto } from './dto/get-visits.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  create(@Body() createVisitDto: CreateVisitDto) {
    return this.visitsService.create(createVisitDto);
  }

  @Get()
  findAll(@Query(ValidationPipe) filter: GetVisitsDto) {
    return this.visitsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitDto: UpdateVisitDto) {
    return this.visitsService.update(+id, updateVisitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitsService.remove(+id);
  }
}
