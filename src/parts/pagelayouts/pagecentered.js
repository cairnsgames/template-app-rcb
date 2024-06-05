import { Container, Row, Col } from "react-bootstrap";

// used to wrape a page to be full screen
// middle = horiz and vertical center
// center = horiz center
const PageCentered = ({ className = "", style = {}, position, children }) => {
    const classes = "pt-1";
  return (
    <Container fluid style={{ ...style, minHeight: "85%", maxHeight: "100%" }}
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
