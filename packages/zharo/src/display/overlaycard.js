import React from 'react';
import './overlaycard.css'; // Ensure you create this CSS file

const OverlayCard = (props) => {
  return (
    <div
      className={`overlay-card`}
      style={{
        maxWidth: props.width ?? "100%",
        maxHeight: props.height ?? "100%",
        overflowY: "hidden",
        border: "2px solid green",
        borderRadius: "0.5rem",
        ...props.style,
        ...props.item?.style,
      }}
    >
      <img
        src={props.src}
        alt={props.title}
        className="card-img"
        style={{ borderRadius: "0.5rem" }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = "images/noimage.png";
        }}
      />
      <div className="card-img-overlay">
        <div className="card-img-content">
          <h5 className="card-title">{props.title}</h5>
          <p className="card-text">{props.text}</p>
          {props.modified && <p className="card-text">{props.modified}</p>}
        </div>
      </div>
    </div>
  );
};

export default OverlayCard;
