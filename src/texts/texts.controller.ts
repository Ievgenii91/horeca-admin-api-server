import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { TextsService } from './texts.service';
import { AuthGuard } from '@nestjs/passport';
import { Text } from 'src/schemas/text.schema';
import { BaseDto } from '../common/dto/base.dto';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(TransformInterceptor)
@Controller('texts')
export class TextsController {
  constructor(private textsService: TextsService) {}
  @Get()
  getTexts(@Query() { clientId }: BaseDto) {
    return this.textsService.getTexts(clientId);
  }

  @Post()
  rewriteTexts(@Body() body: Partial<Text>, @Query() dto: BaseDto) {
    return this.textsService.createTexts(body, dto.clientId);
  }
}
