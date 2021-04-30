import { BotContext, SessionData } from './common/bot.context';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionService {
  private session: SessionData;

  clearOrder(ctx: BotContext) {
    ctx.session.order = []; // clear order on restart
    ctx.session.hasCrossDone = false;
  }
}
