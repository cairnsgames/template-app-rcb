import { Box2Heart, ChevronRight, PersonCircle, Toggles } from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Features = (props) => {
    return (<div>
    <h2 className="pb-2">Features</h2>
    <Row className="g-4 pb-5" xs={1} md={2} lg={3}>
      <Col className="feature">
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
        <div className="feature-icon bg-secondary  p-3">
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
        <div className="feature-icon bg-info  p-2">
          <Toggles color="white" size="24" /> <span style={{fontSize:"1.5rem",color:"white",fontWeight:700}}>Featured title</span>
        </div>
        <h2>Featured title</h2>
        <p>Paragraph of text beneath the heading to explain the heading. We'll add onto it with another sentence and probably just keep going until we run out of words.</p>
        <a href="#" className="icon-link">
          Call to action
          <ChevronRight />
        </a>
      </Col>
    </Row>
  </div>)
}

export default Features;