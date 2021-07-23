import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { UsersService } from './users.service';

@UseInterceptors(TransformInterceptor)
@Controller('v1/users')
export class UsersController {
  constructor(private usersModel: UsersService) {}
  @Get()
  getUser() {
    return this.usersModel.getUsers();
  }

  @Get('/customers')
  getCustomers() {
    return [];
  }
}
