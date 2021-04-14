import { Body, Controller, Get, Post, UseGuards, Param } from '@nestjs/common';
import { TextService } from './text.service';
import { AuthGuard } from '@nestjs/passport';
import { Text } from 'src/schemas/text.schema';
import { BaseDto } from './../common/dto/base.dto';
@UseGuards(AuthGuard('jwt'))
@Controller('texts')
export class TextController {
  constructor(private textService: TextService) {}
  @Get()
  getTexts(@Param() dto: BaseDto) {
    return this.textService.getTexts(dto.clientId);
  }

  @Post()
  rewriteTexts(@Body() body: Partial<Text>, @Param() dto: BaseDto) {
    return this.textService.createTexts(body, dto.clientId);
  }
}
