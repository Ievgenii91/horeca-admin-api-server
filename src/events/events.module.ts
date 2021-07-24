import { forwardRef, Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [forwardRef(() => OrdersModule)],
  providers: [EventsGateway],
})
export class EventsModule {}
