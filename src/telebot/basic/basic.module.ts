import { Module } from '@nestjs/common';
import { ClientModule } from 'src/client/client.module';
import { TextModule } from 'src/text/text.module';
import { BasicService } from './basic.service';
import { EventsService } from './events.service';
import { KeyboardFactory } from './keyboard.factory';
import { ViewService } from './view.service';
import { SessionService } from './session.service';
import { UserModule } from 'src/user/user.module';
@Module({
  imports: [ClientModule, TextModule, UserModule],
  providers: [
    BasicService,
    EventsService,
    KeyboardFactory,
    ViewService,
    SessionService,
  ],
})
export class BasicModule {}
