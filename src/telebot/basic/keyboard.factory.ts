import { Injectable } from '@nestjs/common';
import { Markup } from 'telegraf';
import {
  BACK_ACTION,
  BACK_TO_FOOD_ACTION,
  ORDER_EDIT,
  CONTINUE_ORDER_ACTION,
  FOOD_ACTION_NAME,
  DRINK_ACTION_NAME,
  MY_BONUS_ACTION_NAME,
  SHARE_BONUS,
  ORDER,
} from './common/actions';

const getProductsButtons = (a?, b?, c?, d?, e?) => [];
@Injectable()
export class KeyboardFactory {
  getKeyboard(name, { session, i18n }) {
    const { products, user, order } = session;
    switch (name) {
      case 'DRINKS_KEYBOARD':
        return [
          [
            Markup.button.callback(FOOD_ACTION_NAME, FOOD_ACTION_NAME),
            Markup.button.callback(i18n.t('go_back'), BACK_TO_FOOD_ACTION),
          ],
          ...getProductsButtons(products, 'bar', i18n, user, order).map((v) => [
            v,
          ]),
        ];
      case 'DRINKS_KEYBOARD_WITH_ORDER':
        return [
          [
            Markup.button.callback(FOOD_ACTION_NAME, FOOD_ACTION_NAME),
            Markup.button.callback(i18n.t('order'), ORDER_EDIT),
          ],
          ...getProductsButtons(products, 'bar', i18n, user, order).map((v) => [
            v,
          ]),
        ];
      case 'FOOD_KEYBOARD':
        return [
          [
            Markup.button.callback(DRINK_ACTION_NAME, DRINK_ACTION_NAME),
            Markup.button.callback(i18n.t('go_back'), BACK_ACTION),
          ],
          ...getProductsButtons(products, 'food', i18n).map((v) => [v]),
        ];
      case 'FOOD_KEYBOARD_WITH_ORDER':
        return [
          [
            Markup.button.callback(DRINK_ACTION_NAME, DRINK_ACTION_NAME),
            Markup.button.callback(i18n.t('order'), ORDER_EDIT),
          ],
          ...getProductsButtons(products, 'food', i18n).map((v) => [v]),
        ];
    }
  }
}
