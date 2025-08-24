import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private users = new Map<string, string>();

  afterInit(server: Server) {
    console.log('WebSocket Initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.users.set(userId, client.id);
    console.log(`User ${userId} registered with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  handleMessage(
    @MessageBody()
    data: { senderId: string; receiverId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const receiverSocketId = this.users.get(data.receiverId);

    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('receive_message', data);
    } else {
      console.log(`User ${data.receiverId} is offline`);
    }

    return { status: 'ok', ...data };
  }
}
