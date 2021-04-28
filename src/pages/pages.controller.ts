import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
@UseInterceptors(TransformInterceptor)
@Controller('pages')
export class PagesController {
  @Get()
  getPages() {
    return [];
  }
}
