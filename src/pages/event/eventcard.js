import Card from "react-bootstrap/Card";

function ImgOverlayExample(props) {
  return (
    <Card
      className="masonry-brick bg-dark text-white"
      style={{
        maxWidth: props.width,
        maxHeight: props.height,
        overflowY: "hidden",
        border: "2px solid green",
        borderRadius: "2rem",
      }}
    >
      <Card.Img
        src={props.src ? `images/${props.src}` : "images/9.png"}
        alt="Card image"
        style={{ borderRadius: "2rem" }}
      />
      {/* <Card.ImgOverlay>
        <div className="card-img-content">
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </Card.Text>
        <Card.Text>Last updated 3 mins ago</Card.Text>
        </div>
      </Card.ImgOverlay> */}
    </Card>
  );
}

export default ImgOverlayExample;
