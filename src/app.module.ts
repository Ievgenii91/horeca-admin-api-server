import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientModule } from './client/client.module';
import { AuthzModule } from './authz/authz.module';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { TelebotModule } from './telebot/telebot.module';
import { TextModule } from './text/text.module';
import { EventsModule } from './events/events.module';
import { ProductModule } from './product/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthzModule,
    ClientModule,
    OrderModule,
    UserModule,
    TelebotModule,
    TextModule,
    EventsModule,
    ProductModule,
  ],
})
export class AppModule {}
