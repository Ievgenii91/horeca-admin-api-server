import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import I18n from 'telegraf-i18n';

import {
  DRINK_ACTION_NAME,
  FOOD_ACTION_NAME,
  MY_BONUS_ACTION_NAME,
  ORDER,
  SHARE_BONUS,
} from './common/actions';

@Injectable()
export class ViewService {
  getHomeView(translator: I18n): any {
    return Markup.keyboard([
      [translator.t(FOOD_ACTION_NAME), translator.t(DRINK_ACTION_NAME)],
      [translator.t(ORDER)],
      [translator.t(MY_BONUS_ACTION_NAME), translator.t(SHARE_BONUS)],
    ])
      .oneTime(false)
      .resize(false);
  }
}
