import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Logger,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { ClientId } from 'src/decorators/client-id.decorator';

@UseInterceptors(TransformInterceptor)
@Controller('v1/employees')
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);

  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  findAll(@ClientId() clientId: string) {
    return this.employeesService.findAll(clientId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    this.logger.log(
      `update employee ${id} with ${JSON.stringify(updateEmployeeDto)}`,
    );
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
