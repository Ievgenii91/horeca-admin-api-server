import { Injectable } from '@nestjs/common';
import {
  BACK_ACTION,
  BACK_TO_FOOD_ACTION,
  ORDER_EDIT,
  CONTINUE_ORDER_ACTION,
  FOOD_ACTION_NAME,
  DRINK_ACTION_NAME,
  SUGGEST_ACTION_NAME,
  MY_BONUS_ACTION_NAME,
  SHARE_BONUS,
  ORDER,
} from './common/actions';
import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { KeyboardFactory } from './keyboard.factory';
import { ViewService } from './view.service';
import { SessionService } from './session.service';

@Update()
@Injectable()
export class EventsService {
  constructor(
    private keyboardFactory: KeyboardFactory,
    private viewService: ViewService,
    private sessionService: SessionService,
  ) {}
  @Start()
  async start(@Ctx() ctx) {
    const msg = ctx.i18n.t('hello_message');
    if (ctx.startPayload) {
      // await userService.addReferral(ctx, next);
    }
    this.sessionService.clearOrder(ctx);
    await ctx.reply(msg, this.viewService.getHomeView(ctx.i18n));
  }

  @Help()
  async help(@Ctx() ctx) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hears(@Ctx() ctx) {
    await ctx.reply('Hey there');
  }
}
