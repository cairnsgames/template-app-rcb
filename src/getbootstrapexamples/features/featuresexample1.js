import { Box2Heart, ChevronRight, PersonCircle, Toggles } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ExampleFeatures1 = () => {
    return (<Container fluid className="px-1 py-2 px-lg-3 py-lg-5" id="featured-3">
    <h2 className="pb-2 border-bottom">Features</h2>
    <Row className="g-4 pb-5" xs={1} lg={3}>
      <Col className="feature col">
        <div className="feature-icon bg-primary p-3">
          <Box2Heart color="white" size="24" />
        </div>
        <h2>Featured title</h2>
        <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
        <a href="#" className="icon-link">
          Call to action
          <ChevronRight />
        </a>
      </Col>
      <Col className="feature col">
        <div className="feature-icon bg-primary  p-3">
          <PersonCircle  color="white" size="24"/>
        </div>
        <h2>Featured title</h2>
        <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
        <a href="#" className="icon-link">
          Call to action
          <ChevronRight />
        </a>
      </Col>
      <Col className="feature col">
        <div className="feature-icon bg-primary  p-3">
          <Toggles color="white" size="24" />
        </div>
        <h2>Featured title</h2>
        <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
        <a href="#" className="icon-link">
          Call to action
          <ChevronRight />
        </a>
      </Col>
    </Row>
  </Container>)
}

export default ExampleFeatures1;