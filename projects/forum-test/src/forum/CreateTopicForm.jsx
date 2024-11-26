import React, { useState } from 'react';
import { useForum } from './ForumProvider';
import { Button, Form, Modal } from 'react-bootstrap';

const CreateTopicForm = ({ show, handleClose }) => {
  const { rooms, user, addTopic } = useForum();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTopic = {
      id: Date.now(), // Simple ID generation
      title,
      author: user.name,
      firstLine: content.split('\n')[0], // First line for preview
      content,
      newComments: 0,
      comments: [],
      read: false
    };

    // Use the addTopic function from the context
    addTopic(newTopic);
    handleClose(); // Close the modal after submission
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter topic content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Topic
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTopicForm;
