export interface RoomI {
  id: string;
  usersOn: string[];
}

export const joinUser = (
  rooms: RoomI[],
  dto: { roomId: string; userName: string },
) => {
  const room: RoomI = rooms.find((room: RoomI) => room.id === dto.roomId);

  if (!room) return rooms;
  if (room.usersOn.includes(dto.userName)) return rooms;

  room.usersOn.push(dto.userName);

  const idx: number = rooms.findIndex((room: RoomI) => room.id === dto.roomId);
  rooms[idx] = room;

  return rooms;
};

export const leaveUser = (
  rooms: RoomI[],
  dto: { roomId: string; userName: string },
) => {
  const room: RoomI = rooms.find((room: RoomI) => room.id === dto.roomId);

  if (!room) return rooms;

  const idx: number = rooms.findIndex((room: RoomI) => room.id === dto.roomId);

  const roomIdx = room.usersOn.findIndex((user) => user === dto.userName);
  if (roomIdx === -1) return rooms;
  room.usersOn.splice(roomIdx, 1);

  rooms[idx] = room;

  return rooms;
};
