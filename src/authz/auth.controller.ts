import { Controller, Post } from '@nestjs/common';

@Controller()
export class AuthController {
  @Post()
  login() {
    return null;
  }

  @Post()
  logout() {
    return null;
  }

  @Post()
  signup() {
    return null;
  }
}
