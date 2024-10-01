import React from "react";
import { combineUrlAndPath } from "../../../../src/functions/combineurlandpath";

const VideoDescription = (props) => {
  const { item, style, className } = props;

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} video-description`} style={style}>
      <video
        controls
        className={props.className}
        style={{ ...props.style, maxWidth: "90%" }}
      >
        <source src={combineUrlAndPath(process.env.REACT_APP_FILES,props.item?.url)} />
      </video>
      <h3>{item.title}</h3>
      <div>{item.content}</div>
    </div>
  );
};

export default VideoDescription;
