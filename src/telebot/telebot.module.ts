import { Module } from '@nestjs/common';
import { TelegrafModule, TelegrafModuleOptions } from 'nestjs-telegraf';
import { ClientsModule } from 'src/clients/clients.module';
import { BasicModule } from './basic/basic.module';
import { UsersModule } from '../users/users.module';
import { ClientsService } from 'src/clients/clients.service';
import { session } from 'telegraf'; // TODO: rewise
@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ClientsModule, UsersModule],
      useFactory: async (
        clientService: ClientsService,
      ): Promise<TelegrafModuleOptions> => {
        const [client] = await clientService.getClients(); // TODO: multiply
        return {
          token: client.botToken,
          botName: client.botName,
          middlewares: [session()],
        };
      },
      inject: [ClientsService],
    }),
    BasicModule,
  ],
})
export class TelebotModule {}
