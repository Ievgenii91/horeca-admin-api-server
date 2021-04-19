import { Controller, Get } from '@nestjs/common';

@Controller('pages')
export class PagesController {
  @Get()
  getPages() {
    return [];
  }
}
