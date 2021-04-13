import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Session,
  ValidationPipe,
} from '@nestjs/common';
import { Order } from 'src/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('orders')
  getOrders(
    @Session() session: Record<string, string>,
    @Param('status') status = 'new',
    @Param('cliendId') id?: string,
  ) {
    const clientId = id || session.clientId;
    return this.orderService.getOrders({
      clientId,
      status,
    });
  }

  @Post('order')
  createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }
}
