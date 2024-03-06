import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RoomI, UserI, joinUser, leaveUser } from 'src/utils/user';

const getCookie = (client: Socket) => {
  return Number(client.handshake.headers.cookie?.split('=')[1]);
};

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
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

  handleConnection(client: Socket, ...args: any[]) {
    console.log('client connected', getCookie(client));
  }

  handleDisconnect(client: Socket) {
    const cookie = getCookie(client);
    if (cookie) {
      this.closeConn(cookie);
      console.log('client disconnected', getCookie(client));
    } else {
      console.log('no cookie');
    }
  }

  closeConn(cookie: number) {
    this.rooms.forEach((room, idx) => {
      this.rooms[idx].usersOn = room.usersOn.filter(
        (user) => user.userId !== cookie,
      );
    });

    this.server.emit('users', JSON.stringify(this.rooms));
  }

  @SubscribeMessage('join')
  join(client: Socket, dto: { roomId: string; user: UserI }): string {
    const cookie = getCookie(client);
    if (cookie) {
      client.join(cookie.toString());

      this.server.emit(
        'users',
        JSON.stringify(joinUser(this.rooms, dto, cookie)),
      );
      return `joined to room: ${dto.roomId}`;
    } else {
      console.log('no cookie');
    }
  }

  @SubscribeMessage('leave')
  leave(client: Socket, dto: { roomId: string; userId: number }): string {
    const cookie = getCookie(client);
    if (cookie) {
      client.leave(cookie.toString());

      dto.userId = cookie;
      this.server.emit('users', JSON.stringify(leaveUser(this.rooms, dto)));
      return `leaved to room: ${dto.roomId}`;
    } else {
      console.log('no cookie');
    }
  }

  @SubscribeMessage('send')
  test(client: Socket, msg: { roomId: string; message: string }): string {
    this.server.to(msg.roomId).emit('message', msg.message);
    return msg.message;
  }
}
