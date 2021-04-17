import { Module } from '@nestjs/common';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { ClientModule } from 'src/client/client.module';
import { BasicModule } from './basic/basic.module';
import { ClientService } from 'src/client/client.service';
import { session } from 'telegraf'; // TODO: rewise
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ClientModule],
      useFactory: async (
        clientService: ClientService,
      ): Promise<TelegrafModuleOptions> => {
        const [client] = await clientService.getClients(); // TODO: multiply
        return {
          token: client.botToken,
          botName: client.botName,
          // include: [BasicModule],
          middlewares: [session()],
        };
      },
      inject: [ClientService],
    }),
    BasicModule,
  ],
})
export class TelebotModule {}
