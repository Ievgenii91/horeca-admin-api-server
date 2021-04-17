import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { TextModule } from 'src/text/text.module';
import { BasicService } from './basic.service';
import { EventsService } from './events.service';

@Module({
  imports: [ClientModule, TextModule],
  providers: [BasicService, EventsService],
})
export class BasicModule {}
