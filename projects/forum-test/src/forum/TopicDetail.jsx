import React, { useContext, useState, useEffect } from 'react';
import { useForum } from './ForumProvider';
import { Button } from 'react-bootstrap';
import { useInView } from 'react-intersection-observer';

const TopicDetail = () => {
  const { selectedRoom, selectedTopic, addComment, selectTopic, markCommentAsRead, markTopicAsRead } = useForum();
  const topic = selectedTopic || (selectedRoom ? selectedRoom.selectedTopic : null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (topic) {
      markTopicAsRead(topic); // Mark the topic as read when the component mounts
    }
  }, [topic, markTopicAsRead]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  const handleBack = () => {
    selectTopic(null);
  };

  const Comment = ({ comment }) => {
    const { ref, inView } = useInView({
      threshold: 0.1,
      onChange: (inView) => {
        if (inView && !comment.read) {
          markCommentAsRead(comment.id);
        }
      },
    });

    return (
      <div ref={ref} className={`comment ${comment.read ? '' : 'unread-comment'}`}>
        <p>{comment.author}: {comment.text}</p>
      </div>
    );
  };

  const unreadCount = topic ? topic.comments.filter(comment => !comment.read).length : 0;

  return (
    <div>
      <Button variant="secondary" onClick={handleBack}>Back to Topic List</Button>
      {topic ? (
        <div>
          <h2>
            {topic.title}
          </h2>
          {unreadCount > 0 && <p className="badge bg-danger">{unreadCount} unread of 100</p>}
          <p>{topic.content}</p>
          <div>
            <h3>Comments</h3>
            {topic.comments.map(comment => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleAddComment}>Submit</button>
        </div>
      ) : (
        <p>Select a topic to view details.</p>
      )}
    </div>
  );
};

export default TopicDetail;
