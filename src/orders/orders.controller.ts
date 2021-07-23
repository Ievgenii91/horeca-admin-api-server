import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { TransformInterceptor } from 'src/common/response-transform.interceptor';
import { Order } from 'src/schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
import { OrdersService } from './orders.service';

@UseInterceptors(TransformInterceptor)
@Controller('v1/orders')
export class OrderController {
  constructor(private orderService: OrdersService) {}

  @Get()
  getOrders(@Query() getOrdersDto: GetOrdersDto) {
    return this.orderService.getOrders(getOrdersDto);
  }

  @Post()
  createOrder(
    @Body(ValidationPipe) createOrderDto: CreateOrderDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Order> {
    const order = this.orderService.createOrder(createOrderDto);
    // TODO: move to util
    response.cookie('bc_cartId', null, {
      httpOnly: false,
      sameSite: 'none',
      secure: true,
      maxAge: 0,
    });
    return order;
  }
}
