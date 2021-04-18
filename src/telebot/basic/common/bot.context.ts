import { Context } from 'telegraf';

export interface SessionData {
  chatId?: number;
  order?: any[];
  hasCrossDone?: boolean;
}

export interface BotContext extends Context {
  clientId?: string;
  session?: SessionData;
}
