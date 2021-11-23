import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { TimetrackingService } from './timetracking.service';
import { CreateTimetrackingDto } from './dto/create-timetracking.dto';
import { UpdateTimetrackingDto } from './dto/update-timetracking.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ClientId } from 'src/decorators/client-id.decorator';
import { SearchTimetrackingDto } from './dto/search-timetracking.dto';

@UseInterceptors(TransformInterceptor)
@Controller('v1/timetracking')
export class TimetrackingController {
  private readonly logger = new Logger(TimetrackingController.name);

  constructor(private readonly timetrackingService: TimetrackingService) {}

  @Post()
  create(@Body() createTimetrackingDto: CreateTimetrackingDto) {
    this.logger.log(
      `create timetracking by ${createTimetrackingDto.employeeId} with startDate ${createTimetrackingDto.startDate} and endDate ${createTimetrackingDto.endDate}`,
    );
    return this.timetrackingService.create(createTimetrackingDto);
  }

  @Get()
  findAll(
    @ClientId() clientId: string,
    @Query(ValidationPipe) searchTimetrackingDto: SearchTimetrackingDto,
  ) {
    return this.timetrackingService.findAll(searchTimetrackingDto);
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
    this.logger.log(
      `update timetracking ${id} by ${updateTimetrackingDto.employeeId} with startDate ${updateTimetrackingDto.startDate} and endDate ${updateTimetrackingDto.endDate}`,
    );
    return this.timetrackingService.update(id, updateTimetrackingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timetrackingService.remove(id);
  }
}
