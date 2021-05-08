import { Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [OrderModule],
  providers: [EventsGateway],
})
export class EventsModule {}
