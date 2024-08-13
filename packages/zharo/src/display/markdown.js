import React from "react";
import { getImageSrc } from "../getimagesrc";
const Markdown = React.lazy(() => import("react-markdown"));

const MarkdownContent = (props) => {
  const { item, content, style, className } = props;

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} markdown`} style={style}>
      {item?.type === 5 && (
        <img
          className={className}
          src={getImageSrc(item?.url)}
          alt={item?.title ?? `image ${id}`}
          style={{ maxWidth: "100%" }}
        />
      )}
      <Markdown
        height="200px"
      >{item.content.replace(/\\n/g, "\n")}</Markdown>
    </div>
  );
};

export default MarkdownContent;
