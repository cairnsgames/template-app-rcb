
import React from "react";
import { getImageSrc } from "../getimagesrc";

const ImageOnly = (props) => {
  const { item, className, style } = props;
  return (
    <img
      className={`${className ?? ""} image-only`}
      style={{ ...style, maxWidth: "100%" }}
      src={getImageSrc(item?.url)}
      alt={item?.title ?? `image ${item?.id}`}
      onerror="this.onerror=null;this.src='images/noimage.png';"
    />
  );
};

export default ImageOnly;
