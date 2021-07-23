import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ClientsModule } from '../clients/clients.module';
import { UsersModule } from '../users/users.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ClientsModule,
    UsersModule,
    forwardRef(() => EventsModule),
  ],
  providers: [OrdersService],
  controllers: [OrderController],
  exports: [OrdersService],
})
export class OrdersModule {}
