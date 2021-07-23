import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';
import { AuthzModule } from './authz/authz.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { TelebotModule } from './telebot/telebot.module';
import { TextModule } from './texts/texts.module';
import { EventsModule } from './events/events.module';
import { ProductsModule } from './products/products.module';
import { PagesModule } from './pages/pages.module';
import { CartModule } from './cart/cart.module';
import { TransformInterceptor } from './common/response-transform.interceptor';
import { CategoriesModule } from './categories/categories.module';
import { VisitsModule } from './visits/visits.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthzModule,
    EventsModule,
    ClientsModule,
    OrdersModule,
    UsersModule,
    // TelebotModule,
    TextModule,
    ProductsModule,
    PagesModule,
    CartModule,
    CategoriesModule,
    VisitsModule,
  ],
  providers: [TransformInterceptor],
})
export class AppModule {}
