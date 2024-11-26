import React, { createContext, useContext, useState, useEffect } from "react";
import { mockData } from "./mockData";

const ForumContext = createContext();

export const ForumProvider = ({ children, user }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSubroom, setSelectedSubroom] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const calculateUnreadTopics = (rooms) => {
    return rooms.map((room) => ({
      ...room,
      unreadTopics: room.topics.filter(
        (topic) =>
          !topic.read || topic.comments.some((comment) => !comment.read)
      ).length,
    }));
  };

  useEffect(() => {
    const updatedRooms = calculateUnreadTopics(mockData.rooms);
    setRooms(updatedRooms);
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      const updatedRooms = calculateUnreadTopics(rooms);
      setRooms(updatedRooms);
    }
  }, [selectedRoom, selectedTopic]);

  const markTopicAsRead = (topic) => {
    if (!topic) return;

    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        const updatedTopics = room.topics.map((t) => {
          if (t.id === topic.id) {
            t.read = true;
            return t;
          }
          return t;
        });
        return {
          ...room,
          topics: updatedTopics,
          unreadTopics: calculateUnreadTopics([{ ...room, topics: updatedTopics }])[0].unreadTopics,
        };
      })
    );
  };

  const markCommentAsRead = (commentId) => {
    if (!selectedTopic) return;

    setRooms((prevRooms) => {
      const newRooms = prevRooms.map((room) => {
        const updatedTopics = room.topics.map((topic) => {
          if (topic.id === selectedTopic.id) {
            const updatedComments = topic.comments.map((comment) => {
              if (comment.id === commentId) {
                comment.read = true;
              }
              return comment;
            });
            const count = updatedComments.filter(comment => !comment.read).length; // Use updatedComments for count
            return { ...topic, comments: updatedComments, newComments: count }; // Update newComments dynamically
          }
          return topic;
        });
        return { ...room, topics: updatedTopics };
      });
      return newRooms;
    });
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setSelectedSubroom(null);
    setSelectedTopic(null);
  };

  const selectSubroom = (subroom) => {
    setSelectedSubroom(subroom);
    setSelectedTopic(null);
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
  };

  const addTopic = (newTopic) => {
    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom.id) {
        return { ...room, topics: [...room.topics, newTopic] };
      }
      return room;
    });
    setRooms(updatedRooms);

    const updatedRoomsWithUnread = calculateUnreadTopics(updatedRooms);
    setRooms(updatedRoomsWithUnread);
  };

  const addComment = (commentText) => {
    if (!selectedTopic) return;

    const comment = {
      id: Date.now(),
      author: user.name,
      text: commentText,
      read: false,
    };

    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        const updatedTopics = room.topics.map((topic) => {
          if (topic.id === selectedTopic.id) {
            const updatedComments = [...topic.comments, comment];
            setSelectedTopic({ ...topic, comments: updatedComments });
            return { ...topic, comments: updatedComments };
          }
          return topic;
        });
        return { ...room, topics: updatedTopics };
      })
    );
  };

  return (
    <ForumContext.Provider
      value={{
        rooms,
        setRooms,
        selectedRoom,
        selectRoom,
        selectedSubroom,
        selectSubroom,
        selectedTopic,
        selectTopic,
        setSelectedTopic,
        user,
        addTopic,
        markTopicAsRead,
        markCommentAsRead,
        addComment,
      }}
    >
      {children}
    </ForumContext.Provider>
  );
};

export const useForum = () => {
  return useContext(ForumContext);
};
