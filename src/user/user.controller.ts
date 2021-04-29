import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { UserService } from './user.service';

@UseInterceptors(TransformInterceptor)
@Controller()
export class UserController {
  constructor(private userModel: UserService) {}
  @Get('user/all')
  getUser() {
    return this.userModel.getUsers();
  }

  @Get('customers')
  getCustomers() {
    return [];
  }
}
