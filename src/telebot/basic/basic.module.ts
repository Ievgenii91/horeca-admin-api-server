import { Module } from '@nestjs/common';
import { ClientsModule } from 'src/clients/clients.module';
import { TextsModule } from 'src/texts/texts.module';
import { BasicService } from './basic.service';
import { EventsService } from './events.service';
import { KeyboardFactory } from './keyboard.factory';
import { ViewService } from './view.service';
import { SessionService } from './session.service';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports: [ClientsModule, TextsModule, UsersModule],
  providers: [
    BasicService,
    EventsService,
    KeyboardFactory,
    ViewService,
    SessionService,
  ],
})
export class BasicModule {}
