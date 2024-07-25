import React from "react";
import {
  Button,
  ButtonGroup,
  Alert,
  Form,
  Tabs,
  Tab,
  Nav,
  ProgressBar,
  Pagination,
  Accordion,
  Card,
  ListGroup,
  Badge,
  Tooltip,
  OverlayTrigger,
  Popover,
  Navbar,
  NavDropdown,
  Breadcrumb,
  Jumbotron,
} from "react-bootstrap";

const ComponentShowcase = () => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Tooltip example
    </Tooltip>
  );

  const renderPopover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Popover right</Popover.Header>
      <Popover.Body>
        And here's some <strong>amazing</strong> content. It's very engaging.
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="container" style={{overflowY: "scroll"}}>
      <h3>Buttons</h3>
      <Button variant="primary">Primary Button</Button>
      <Button variant="secondary">Secondary Button</Button>
      <Button variant="success">Success Button</Button>
      <Button variant="danger">Danger Button</Button>
      <Button variant="warning">Warning Button</Button>
      <Button variant="info">Info Button</Button>
      <Button variant="light">Light Button</Button>
      <Button variant="dark">Dark Button</Button>

      <h3>Alerts</h3>
      <Alert variant="primary">This is a primary alert</Alert>
      <Alert variant="secondary">This is a secondary alert</Alert>

      <h3>Forms</h3>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <h3>Tabs</h3>
      <Tabs defaultActiveKey="home">
        <Tab eventKey="home" title="Home">
          <div>Home content</div>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <div>Profile content</div>
        </Tab>
      </Tabs>

      <h3>Nav</h3>
      <Nav variant="tabs" defaultActiveKey="/home">
        <Nav.Item>
          <Nav.Link href="/home">Active</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Link</Nav.Link>
        </Nav.Item>
      </Nav>

      <h3>Progress Bar</h3>
      <ProgressBar variant="success" now={60} label={`${60}%`} />

      <h3>Pagination</h3>
      <Pagination variant="danger">
        <Pagination.Item active>{1}</Pagination.Item>
        <Pagination.Item>{2}</Pagination.Item>
        <Pagination.Item>{3}</Pagination.Item>
      </Pagination>

      <h3>List Group</h3>
      <ListGroup>
        <ListGroup.Item>Cras justo odio</ListGroup.Item>
        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
      </ListGroup>

      <h3>Badges</h3>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>

      <h3>Tooltips</h3>
      <OverlayTrigger placement="right" overlay={renderTooltip}>
        <Button variant="secondary">Hover me to see</Button>
      </OverlayTrigger>

      <h3>Popovers</h3>
      <OverlayTrigger trigger="click" placement="right" overlay={renderPopover}>
        <Button variant="secondary">Click me to see</Button>
      </OverlayTrigger>

      <h3>Navbar</h3>
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar>

      <h3>Breadcrumbs</h3>
      <Breadcrumb>
        <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
          Library
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>



      {/* 

      <h3>Accordion</h3>
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Click me!
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>

            <h3>Jumbotron</h3>
      <Jumbotron>
        <h1>Hello, world!</h1>
        <p>This is a simple hero unit, a simple jumbotron-style component.</p>
      </Jumbotron>

      

      
      

      

     

       */}
    </div>
  );
};

export default ComponentShowcase;
