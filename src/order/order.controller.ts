import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Order } from 'src/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { OrderService } from './order.service';
@Controller()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('orders')
  getOrders(@Query() getOrdersDto: GetOrdersDto) {
    return this.orderService.getOrders(getOrdersDto);
  }

  @Post('order')
  createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    return this.orderService.createOrder(createOrderDto);
  }
}
