import { Container, Row, Col } from "react-bootstrap";

// used to wrap a page to be full screen
// middle = horiz and vertical center
// center = horiz center
const PageCentered = ({ className = "", style = {}, position, children }) => {
  const classes = "p-2 pt-1";
  return (
    <Container
      fluid
      style={{
        ...style,
        minHeight: "85%",
        maxHeight: "100%",
        overflowX: "hidden",
      }}
      className="page-centered"
    >
      <Row
        style={{ ...style, minHeight: "85%", maxHeight: "100%" }}
        className={`${className} ${classes}`}
      >
        <Col xs={1} sm={2} md={3}></Col>
        <Col>{children}</Col>
        <Col xs={1} sm={2} md={3}></Col>
      </Row>
    </Container>
  );
};

export default PageCentered;
