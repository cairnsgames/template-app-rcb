import {
  Container,
  Card,
  Row,
  Col,
  Button,
  ButtonGroup,
} from "react-bootstrap";

const AlbumCard = () => {
  return (
    <Col>
      <Card>
        <Card.Header style={{position: "relative"}}>
          <Card.Img variant="top" src="person1.jpeg" />
          <div className="album-image-text">PERSON 1</div>
        </Card.Header>

        <Card.Body>
          <Card.Text>
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </Card.Text>
          <div class="d-flex justify-content-between align-items-center">
            <ButtonGroup>
              <Button size="sm" variant="outline-secondary">
                View
              </Button>
              <Button size="sm" variant="outline-primary">
                Edit
              </Button>
            </ButtonGroup>
            <small class="text-muted">9 mins</small>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const ExampleAlbum = () => {
  return (
    <div class="album py-5 bg-light">
      <Container>
        <Row sm={1} md={2} lg={3} xl={4}>
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
          <AlbumCard />
        </Row>
      </Container>
    </div>
  );
};

export default ExampleAlbum;
