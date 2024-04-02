import Card from "react-bootstrap/Card";

const OverlayCard = (props) => {
  return (
    <Card
      className="bg-dark text-white"
      style={{
        maxWidth: props.width ?? "100%",
        maxHeight: props.height ?? "100%",
        overflowY: "hidden",
        border: "2px solid green",
        borderRadius: "2rem",
      }}
    >
      
        <Card.Img
          src={props.src ? props.src : "images/9.png"}
          alt="Card image"
          style={{ borderRadius: "2rem" }}
        />
        <Card.ImgOverlay>
        <div className="card-img-content">
        <Card.Title>{props.title}</Card.Title>
        <Card.Text>
          This is a wider card with supporting text below as a natural lead-in
          to additional content. This content is a little bit longer.
        </Card.Text>
        <Card.Text>Last updated 3 mins ago</Card.Text>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
}

export default OverlayCard;
