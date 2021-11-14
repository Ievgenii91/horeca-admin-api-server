import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';
import { AuthzModule } from './authz/authz.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { TelebotModule } from './telebot/telebot.module';
import { TextsModule } from './texts/texts.module';
import { EventsModule } from './events/events.module';
import { ProductsModule } from './products/products.module';
import { PagesModule } from './pages/pages.module';
import { CartsModule } from './carts/carts.module';
import { TransformInterceptor } from './common/response-transform.interceptor';
import { CategoriesModule } from './categories/categories.module';
import { VisitsModule } from './visits/visits.module';
import { TimetablesModule } from './timetables/timetables.module';
import { EmployeesModule } from './employees/employees.module';
import { TimetrackingModule } from './timetracking/timetracking.module';
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
    TextsModule,
    ProductsModule,
    PagesModule,
    CartsModule,
    CategoriesModule,
    VisitsModule,
    TimetablesModule,
    EmployeesModule,
    TimetrackingModule,
  ],
  providers: [TransformInterceptor],
})
export class AppModule {}
