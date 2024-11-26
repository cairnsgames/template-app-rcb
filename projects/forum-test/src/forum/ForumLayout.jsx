import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RoomList from './RoomList';
import TopicList from './TopicList';
import TopicDetail from './TopicDetail';
import { useForum } from './ForumProvider';
import './forumStyles.css'; // Importing the CSS file for forum styles

const ForumLayout = () => {
  const { selectedRoom, selectedTopic } = useForum(); // Use selectedTopic instead of selectedSubroom

  return (
    <Container className="forum-layout">
      <Row>
        <Col md={3} className="sidebar">
          <RoomList />
        </Col>
        <Col md={9} className="main-content">
          {selectedRoom ? (selectedTopic ? <TopicDetail /> : <TopicList />) : <div>Please select a room to see topics.</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default ForumLayout;
