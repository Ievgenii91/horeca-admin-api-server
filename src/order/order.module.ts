import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ClientModule } from './../client/client.module';
import { UserModule } from './../user/user.module';
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
    ClientModule,
    UserModule,
    forwardRef(() => EventsModule),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
