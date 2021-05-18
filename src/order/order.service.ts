import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { ClientService } from 'src/client/client.service';
import { EventsGateway } from 'src/events/events.gateway';
import { Order, OrderDocument } from 'src/schemas/order.schema';
import { UserService } from './../user/user.service';
import { CreateOrderDto, RequestInitiator } from './dto/create-order.dto';
import { GetOrdersDto } from './dto/get-orders.dto';
@Injectable()
export class OrderService implements OnModuleInit {
  private names: Array<string>;
  private socketService: EventsGateway;

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private clientService: ClientService,
    private userService: UserService,
    private moduleRef: ModuleRef,
  ) {
    this.names = [
      'грішник',
      'майстер_над_хотдогами',
      'мій_маленький_грішок',
      'файна_мушля',
      'розбійник',
      'зима_близько',
      'наливкович',
      'сидр_сам_себе_не_вип`є',
    ];
  }

  onModuleInit() {
    this.socketService = this.moduleRef.get(EventsGateway, { strict: false });
  }

  getRandomName() {
    return this.names[Math.floor(Math.random() * this.names.length)];
  }

  async generateOrderId() {
    const [order] = await this.orderModel
      .find({})
      .sort({ _id: -1 })
      .limit(1)
      .exec();

    if (!order) {
      return this.getRandomName() + '_1';
    } else {
      const splittedId = order.id.split('_');
      return (
        this.getRandomName() +
        '_' +
        (parseInt(splittedId[splittedId.length - 1]) + 1)
      );
    }
  }

  async rollbackOrder({ id }) {
    //TODO: rewise
    await this.orderModel.deleteOne({ id });
  }

  getOrders(getOrdersDto: GetOrdersDto) {
    return this.orderModel.find(getOrdersDto).exec();
  }

  async finishOrder(id: string): Promise<OrderDocument> {
    return this.orderModel.findOneAndUpdate(
      { id },
      { $set: { status: 'done' } },
      {
        new: true,
        useFindAndModify: false,
      },
    );
  }

  async createOrder(createOrder: CreateOrderDto): Promise<Order> {
    const id = await this.generateOrderId();
    const order = new this.orderModel({
      id,
      black: true,
      status: 'new',
      ...createOrder,
    });
    await order.save();
    await this.userService.addOrUpdateUser({
      orderId: order.id,
      ...createOrder,
      userId:
        createOrder.initiator === RequestInitiator.Site
          ? createOrder.phone
          : createOrder.userId,
    });
    await this.clientService.incrementOrdersCount(createOrder.clientId);

    // PHONECALL_PASS
    // ADMIN_PHONE
    //https://smsc.ua/sys/send.php?login=crashraze&psw=18IM1buta!&phones=380630471200&mes=hello&call=1
    const message = 'У вас новый заказ!';
    axios.get(
      `https://smsc.ua/sys/send.php?login=crashraze&psw=${process.env.PHONECALL_PASS}&phones=${process.env.ADMIN_PHONE}&mes=${message}&call=1`,
    );
    // send on oncoming site
    this.socketService.addOrder(order);
    // send on oncoming in telegram
    return order;
  }
}
