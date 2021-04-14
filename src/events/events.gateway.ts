import { BadGatewayException } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(parseInt(process.env.SOCKETS_PORT), {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('finish_order')
  handleMessage(client: Socket, payload: any): string {
    console.log(payload, 'finish_order');
    return 'Hello world!';
  }

  @SubscribeMessage('test')
  async test(@MessageBody() data: number): Promise<number> {
    return data;
  }

  afterInit(): void {
    console.log('init socket server on port', process.env.SOCKETS_PORT);
  }

  handleConnection(socket: Socket) {
    const clientId = socket.handshake.query.clientId;
    if (!clientId) {
      console.error('clientId for sockets not defined');
      throw new BadGatewayException('clientId for sockets not defined');
    }
    socket.join(clientId);
  }
}
