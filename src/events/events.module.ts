import { forwardRef, Module } from '@nestjs/common';
import { OrderModule } from 'src/order/order.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [forwardRef(() => OrderModule)],
  providers: [EventsGateway],
})
export class EventsModule {}
