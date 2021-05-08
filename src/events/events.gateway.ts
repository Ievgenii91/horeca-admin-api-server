import { BadGatewayException, Logger } from '@nestjs/common';
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
import { OrderService } from '../order/order.service';
@WebSocketGateway({
  transports: ['websocket'],
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger(EventsGateway.name);

  constructor(private orderService: OrderService) {}

  @SubscribeMessage('finish_order')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() { id }: { id: string },
  ): Promise<string> {
    await this.orderService.finishOrder(id);
    return 'Hello world!';
  }

  @SubscribeMessage('add_order')
  handleAddOrderMessage() {
    return 'test add order';
  }

  @SubscribeMessage('test')
  async test(@MessageBody() data: number): Promise<number> {
    return data;
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
}
