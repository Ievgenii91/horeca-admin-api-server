import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { CreateTimetrackingDto } from './dto/create-timetracking.dto';
import { UpdateTimetrackingDto } from './dto/update-timetracking.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';

@UseInterceptors(TransformInterceptor)
@Controller('v1/timetracking')
export class TimetrackingController {
  constructor(private readonly timetrackingService: TimetrackingService) {}

  @Post()
  create(@Body() createTimetrackingDto: CreateTimetrackingDto) {
    return this.timetrackingService.create(createTimetrackingDto);
  }

  @Get()
  findAll() {
    return this.timetrackingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timetrackingService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimetrackingDto: UpdateTimetrackingDto,
  ) {
    return this.timetrackingService.update(id, updateTimetrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetrackingService.remove(id);
  }
}
