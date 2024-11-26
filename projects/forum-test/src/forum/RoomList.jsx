import React from 'react';
import { useForum } from './ForumProvider';

const RoomList = () => {
  const { rooms, selectRoom } = useForum();

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <div key={room.id} className="room" onClick={() => selectRoom(room)}>
          <h3>{room.name} <span style={{ float: 'right' }}>({room.unreadTopics})</span></h3>
        </div>
      ))}
    </div>
  );
};

export default RoomList;
