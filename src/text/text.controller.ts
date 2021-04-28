import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TextService } from './text.service';
import { AuthGuard } from '@nestjs/passport';
import { Text } from 'src/schemas/text.schema';
import { BaseDto } from './../common/dto/base.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(TransformInterceptor)
@Controller('texts')
export class TextController {
  constructor(private textService: TextService) {}
  @Get()
  getTexts(@Query() { clientId }: BaseDto) {
    return this.textService.getTexts(clientId);
  }

  @Post()
  rewriteTexts(@Body() body: Partial<Text>, @Query() dto: BaseDto) {
    return this.textService.createTexts(body, dto.clientId);
  }
}
