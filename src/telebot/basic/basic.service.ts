import { Telegraf } from 'telegraf';
import * as TelegrafI18n from 'telegraf-i18n/lib/i18n';
import { Context } from '../interfaces/context.interface';
import { ClientService } from 'src/client/client.service';
import { TextService } from 'src/text/text.service';
import { ClientDocument } from 'src/schemas/client.schema';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';

@Injectable()
export class BasicService implements OnModuleInit {
  private client: ClientDocument;
  private lastUpdate = null;

  constructor(
    @InjectBot(process.env.BOT_NAME) private bot: Telegraf<Context>,
    private clientService: ClientService,
    private textService: TextService,
  ) {}

  async onModuleInit() {
    await this.initLocales();
    await this.loadProducts();
    this.extendContext(this.client);
  }

  extendContext(client: ClientDocument) {
    // this.bot.context.clientId = client._id;
    // this.bot.context.oncomingChatId = client.oncomingChatId
    // this.bot.context.inprogressOncomingMessages = [];
  }

  timeToRefresh(lastUpdate) {
    if (!lastUpdate) {
      return true;
    }
    const REFRESH_TIMEOUT = 50000;
    return Date.now() - REFRESH_TIMEOUT > lastUpdate;
  }

  async loadProducts() {
    this.bot.use(async (ctx: any, next) => {
      if (!ctx.session) {
        ctx.session = {};
      }
      try {
        if (this.timeToRefresh(this.lastUpdate)) {
          const client = this.client;
          if (!client) {
            throw new Error('client was not found');
          }
          console.log(`load-products triggered for client ${client.name}`);
          ctx.session.products = client.products;

          this.lastUpdate = Date.now();
          // TODO: sync 1C always
        }
      } catch (e) {
        console.error(e);
        if (ctx.updateType !== 'pre_checkout_query') {
          await ctx.reply(ctx.i18n.t('maintenance'));
        }
      }
      return next();
    });
  }

  async initLocales() {
    const i18n = new TelegrafI18n({
      defaultLanguage: 'uk', // ID bot
      useSession: true,
    });
    this.client = this.clientService.entities.find(
      (v) => v.botToken === this.bot.telegram.token,
    ) as ClientDocument;
    const texts = await this.textService.getTexts(this.client.get('id'));
    i18n.loadLocale('uk', texts['_doc']); // TODO remove
    this.bot.use(i18n.middleware());
  }
 
}
