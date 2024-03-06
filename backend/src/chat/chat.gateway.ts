import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomI, UserI, joinUser, leaveUser } from 'src/utils/user';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  rooms: RoomI[] = [
    { id: 'default', usersOn: [] },
    { id: 'cine', usersOn: [] },
    { id: 'juegos', usersOn: [] },
  ];

  handleConnection(client: any, ...args: any[]) {
    console.log('client connected', client.id);
  }

  handleDisconnect(client: any) {
    console.log('client disconnected', client.id);
  }

  @SubscribeMessage('join')
  join(client: Socket, dto: { roomId: string; user: UserI }): string {
    client.join(dto.roomId);
    this.server.emit('users', JSON.stringify(joinUser(this.rooms, dto)));
    return `joined to room: ${dto.roomId}`;
  }

  @SubscribeMessage('leave')
  leave(client: Socket, dto: { roomId: string; user: UserI }): string {
    client.leave(dto.roomId);
    this.server.emit('users', JSON.stringify(leaveUser(this.rooms, dto)));
    return `leaved to room: ${dto.roomId}`;
  }

  @SubscribeMessage('send')
  test(client: Socket, msg: { roomId: string; message: string }): string {
    this.server.to(msg.roomId).emit('message', msg.message);
    return msg.message;
  }
}
