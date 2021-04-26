import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private userModel: UserService) {}
  @Get('user/all')
  getUser() {
    return this.userModel.getUsers();
  }

  @Get('customers')
  getCustomers() {
    return {
      data: [],
    };
  }
}
