import Card from "react-bootstrap/Card";

const OverlayCard = (props) => {
  return (
    <Card
      className={`overlay-card`}
      style={{
        maxWidth: props.width ?? "100%",
        maxHeight: props.height ?? "100%",
        overflowY: "hidden",
        border: "2px solid green",
        borderRadius: "0.5rem",
        ...props.style,
        ...props.item?.style
      }}
    >
      <Card.Img
        src={props.src ? props.src : "images/9.png"}
        alt={props.title}
        style={{ borderRadius: "0.5rem" }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src="images/noimage.png";
        }}
      />
      <Card.ImgOverlay>
        <div className="card-img-content">
          <Card.Title>{props.title}</Card.Title>
          <Card.Text>{props.text}</Card.Text>
          {props.modified && <Card.Text>{props.modified}</Card.Text>}
        </div>
      </Card.ImgOverlay>
    </Card>
  );
};

export default OverlayCard;
