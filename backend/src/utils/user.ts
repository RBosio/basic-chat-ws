export interface RoomI {
  id: string;
  usersOn: UserI[];
}

export interface UserI {
  userId: number;
  name?: string;
}

export const joinUser = (
  rooms: RoomI[],
  dto: { roomId: string; user: UserI },
  cookie: number,
) => {
  const room: RoomI = rooms.find((room: RoomI) => room.id === dto.roomId);

  if (!room) return rooms;
  if (room.usersOn.find((user) => user.userId === cookie)) return rooms;

  dto.user.userId = cookie;
  room.usersOn.push(dto.user);

  const idx: number = rooms.findIndex((room: RoomI) => room.id === dto.roomId);
  rooms[idx] = room;

  return rooms;
};

export const leaveUser = (
  rooms: RoomI[],
  dto: { roomId: string; userId: number },
) => {
  const room: RoomI = rooms.find((room: RoomI) => room.id === dto.roomId);

  if (!room) return rooms;

  const idx: number = rooms.findIndex((room: RoomI) => room.id === dto.roomId);

  const roomIdx = room.usersOn.findIndex((user) => user.userId === dto.userId);
  if (roomIdx === -1) return rooms;
  room.usersOn.splice(roomIdx, 1);

  rooms[idx] = room;

  return rooms;
};
