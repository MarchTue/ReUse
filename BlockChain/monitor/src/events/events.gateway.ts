import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class EventsGateway {

  @WebSocketServer()
  server: Server;

  broadcast(evnet: string, payload: any) {
    this.server.emit(event, payload);
  }

}
