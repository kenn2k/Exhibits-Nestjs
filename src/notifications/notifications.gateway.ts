import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/notifications', cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }
  handleConnection(client: Socket) {
    console.log('WebSocket connected', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('WebSocket disconnected', client.id);
  }

  @SubscribeMessage('newPost')
  handleNewPost(@MessageBody() data: { message: string; user: string }) {
    this.server.emit('newPost', data);
  }
}
