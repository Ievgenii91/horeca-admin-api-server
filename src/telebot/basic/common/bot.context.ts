import { Context } from 'telegraf';
import { User } from './../../../schemas/user.schema';
import { Product } from 'src/schemas/product.schema';
import { I18n } from 'telegraf-i18n';

export interface SessionData {
  chatId?: number;
  order?: any[];
  hasCrossDone?: boolean;
  user?: User;
  products?: Product[];
}

export interface BotContext extends Context {
  clientId?: string;
  session?: SessionData;
  i18n?: I18n;
}
