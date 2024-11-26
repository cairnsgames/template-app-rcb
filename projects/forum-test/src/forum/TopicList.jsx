import React, { useState } from 'react';
import { useForum } from './ForumProvider';
import CreateTopicForm from './CreateTopicForm';
import TopicDisplay from './TopicDisplay'; // Importing the new TopicDisplay component
import { Button } from 'react-bootstrap'; // Importing Button

const TopicList = () => {
  const { selectedRoom, selectSubroom, markTopicAsRead, selectTopic } = useForum(); // Include selectTopic
  const [showCreateTopic, setShowCreateTopic] = useState(false);

  if (!selectedRoom) {
    return <div>Please select a room to see topics.</div>;
  }

  const handleClose = () => setShowCreateTopic(false);
  const handleShow = () => setShowCreateTopic(true);

  const handleTopicClick = (topic) => {
    selectTopic(topic); 
    markTopicAsRead(); // Mark the topic as read
  };

  console.log("TOPICS", selectedRoom.topics)

  return (
    <div className="topic-list">
      <Button variant="primary" onClick={handleShow}>
        Create New Topic
      </Button>
      <CreateTopicForm show={showCreateTopic} handleClose={handleClose} />
      {selectedRoom.topics.map((topic) => (
        <TopicDisplay 
          key={topic.id} 
          topic={topic} 
          onTopicClick={handleTopicClick} 
        /> // Using the new TopicDisplay component for each topic
      ))}
    </div>
  );
};

export default TopicList;
