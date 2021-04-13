import {
  Body,
  Controller,
  Get,
  Post,
  Session,
  UseGuards,
} from '@nestjs/common';
import { TextService } from './text.service';
import { AuthGuard } from '@nestjs/passport';
import { Text } from 'src/schemas/text.schema';

@UseGuards(AuthGuard('jwt'))
@Controller('texts')
export class TextController {
  constructor(private textService: TextService) {}
  @Get()
  getTexts(@Session() session: Record<string, string>) {
    return this.textService.getTexts(session.clientId);
  }

  @Post()
  rewriteTexts(
    @Body() body: Partial<Text>,
    @Session() session: Record<string, string>,
  ) {
    return this.textService.createTexts(body, session.cliendId);
  }
}
