import { Container, Row, Col } from "react-bootstrap";

// used to wrape a page to be full screen
// middle = horiz and vertical center
// center = horiz center
const PageFull = ({ className = "", style = {}, position, children }) => {
  const classes = "pt-1";
  return (
    <Container
      fluid
      style={{ padding: "1rem", ...style, minHeight: "85%", maxHeight: "calc(100vh - 80px)" }}
      className="page-full"
    >
      <Row
        style={{ minHeight: "85%", maxHeight: "100%" }}
        className={`${className} ${classes}`}
      >
        <Col>{children}</Col>
      </Row>
    </Container>
  );
};

export default PageFull;
