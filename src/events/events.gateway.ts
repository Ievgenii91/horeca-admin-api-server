import { BadGatewayException, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OrdersService } from '../orders/orders.service';
@WebSocketGateway({
  transports: ['websocket'],
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  private ordersService: OrdersService;

  static initializationCounts = 0;

  constructor(private moduleRef: ModuleRef) {
    this.logger.warn(
      `${EventsGateway.initializationCounts++} times EVENTS gateway inited`,
      EventsGateway.name,
    );
  }

  onModuleInit() {
    this.ordersService = this.moduleRef.get(OrdersService, { strict: false });
  }

  @SubscribeMessage('finish_order')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { id }: { id: string },
  ): Promise<boolean> {
    await this.ordersService.finishOrder(id);
    client.emit('finish_order', id);
    return true;
  }

  afterInit(): void {
    this.logger.log(`init socket server`, EventsGateway.name);
  }

  handleConnection(socket: Socket) {
    const clientId = socket.handshake.query.clientId;
    if (!clientId) {
      console.error('clientId for sockets not defined');
      throw new BadGatewayException('clientId for sockets not defined');
    }
    socket.join(clientId);
    this.logger.log(`${clientId} room joined`);
  }

  addOrder(order: unknown) {
    this.server.emit('add_order', order);
  }
}
