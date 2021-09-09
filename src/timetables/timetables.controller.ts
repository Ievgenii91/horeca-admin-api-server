import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { CreateTimetableDto } from './dto/create-timetable.dto';
import { UpdateTimetableDto } from './dto/update-timetable.dto';

@Controller('v1/timetables')
export class TimetablesController {
  constructor(private readonly timetablesService: TimetablesService) {}

  @Post()
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetablesService.create(createTimetableDto);
  }

  @Get()
  findAll() {
    return this.timetablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetablesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimetableDto: UpdateTimetableDto,
  ) {
    return this.timetablesService.update(+id, updateTimetableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetablesService.remove(+id);
  }
}
