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

@Update()
@Injectable()
export class EventsService {
  @Start()
  async start(@Ctx() ctx) {
    const tr = ctx.i18n.t('order_button_name');
    await ctx.reply(tr);
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
