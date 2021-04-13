import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userModel: UserService) {}
  @Get('/all')
  getUser() {
    return this.userModel.getUsers();
  }
}
