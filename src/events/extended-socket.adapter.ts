import { AbstractWsAdapter } from '@nestjs/websockets';
import * as io from 'socket.io';
import * as http from 'http';
export class ExtendedSocketIoAdapter extends AbstractWsAdapter {
  protected ioServer: SocketIO.Server;
  constructor(protected server: http.Server) {
    super();
    this.ioServer = io(server);
  }

  bindMessageHandlers() {}

  create(port: number) {
    console.log(
      'websocket gateway port argument is ignored by ExtendedSocketIoAdapter, use the same port of http instead',
    );
    return this.ioServer;
  }
}
