import React from "react";
import {
  BookHalf,
  Chat,
  HandThumbsUp,
  HandThumbsUpFill,
  ThreeDots,
} from "react-bootstrap-icons";
import {
  Button,
  ButtonGroup,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Row,
  Col,
  Dropdown,
} from "react-bootstrap";
import Avatar from "../../components/avatar";

const Post = ({
  title,
  description,
  video,
  image = "https://images.unsplash.com/photo-1682685797886-79020b7462a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  author,
  ownerType = "teacher",
}) => {
  return (
    <article
      className="mt-3"
      style={{
        border: "1px solid #8f2880",
        borderRadius: "10px",
      }}
    >
      <Navbar
        expand="lg"
        bg={ownerType}
        className="p-0"
        style={{
          borderBottom: "1px solid #8f2880",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <Container>
          <Navbar.Brand>
            <Avatar
              githubHandle="cairnswm"
              size={48}
              round={true}
              className="me-3"
            />{" "}
            <span className="mt-2">CairnsWM</span>
          </Navbar.Brand>
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline">
              <ThreeDots />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
              <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>

      <div className="m-0"> 
        {video ? <iframe
          width="100%"
          src="https://www.youtube.com/embed/il_t1WVLNxk"
        ></iframe>
        : <img src={image} width="100%" />}
      </div>

      <div className="m-2">
        <Row>
          <Col>3 hours ago</Col>
          <Col>
            <ButtonGroup className="float-end">
              <Button variant="outline-primary">
                <HandThumbsUpFill />
              </Button>
              <Button variant="outline-primary">
                <Chat />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>

        <div className="m-2">
          <div className="post__likes">
            <Avatar
              src="http://www.gravatar.com/avatar/a16a38cdfe8b2cbd38e8a56ab93238d3"
              size={32}
              round={true}
              className="me-3"
            />

            <span>
              Liked by
              <a className="ms-1 me-1" href="#user?id=123">
                user123
              </a>{" "}
              and 73 others.
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
