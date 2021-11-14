import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { Employee, EmployeeDocument } from 'src/schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

const options: Partial<QueryOptions> = {
  new: true,
  useFindAndModify: false,
};

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    const employee = new this.employeeModel(createEmployeeDto);
    return employee.save();
  }

  findAll() {
    return this.employeeModel.find().exec();
  }

  findOne(_id: string) {
    return this.employeeModel.find({ _id }).exec();
  }

  update(_id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeeModel
      .findOneAndUpdate({ _id }, { $set: updateEmployeeDto }, options)
      .exec();
  }

  remove(_id: string) {
    return this.employeeModel.deleteOne({ _id }).exec();
  }
}
