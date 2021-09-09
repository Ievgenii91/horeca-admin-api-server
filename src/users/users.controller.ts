import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@UseInterceptors(TransformInterceptor)
@Controller('v1/users')
export class UsersController {
  constructor(private usersModel: UsersService) {}
  @Get()
  getUser() {
    return this.usersModel.getUsers();
  }

  @Post()
  addUser(@Body() user: CreateUserDto) {
    return this.usersModel.addUser(user);
  }

  @Get('/customers')
  getCustomers() {
    return [];
  }
}
