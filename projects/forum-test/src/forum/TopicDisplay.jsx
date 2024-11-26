import React from 'react';
import { Button } from 'react-bootstrap'; // Importing Button

const TopicDisplay = ({ topic, onTopicClick }) => {
  const newComments = topic.comments.filter(comment => !comment.read).length; // Calculate unread comments

  return (
    <div 
      className={`topic ${topic.read ? '' : 'unread-topic'}`} // Add 'unread-topic' class for unread topics
      onClick={() => onTopicClick(topic)} 
    >
      <h4 style={{ display: 'flex', justifyContent: 'space-between' }}>
        {topic.title} 
        <span>({newComments})</span>
      </h4>
      <p>Author: {topic.author}</p>
      <p style={{ 
        display: '-webkit-box', 
        WebkitBoxOrient: 'vertical', 
        overflow: 'hidden', 
        WebkitLineClamp: 1, 
        textOverflow: 'ellipsis' 
      }}>
        {topic.firstLine}
      </p>
    </div>
  );
};

export default TopicDisplay;
