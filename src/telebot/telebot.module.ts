import { Module } from '@nestjs/common';
import { TelebotService } from './telebot.service';

@Module({
  providers: [TelebotService]
})
export class TelebotModule {}
