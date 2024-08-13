import React from "react";
import useShareData from "../../../hooks/useshare";
const MarkdownEditor = React.lazy(() => import("@uiw/react-markdown-editor"));


import { getImageSrc } from "../getimagesrc";

const ImageDescription = (props) => {
  const { item, style, className } = props;

  const { Share, fileFromUrl } = useShareData(
    item?.title,
    item?.content,
    item?.url
  );

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} image-description`} style={{...style, ...item.style}}>
      <img
        className={className}
        src={getImageSrc(item?.url)}
        alt={item?.title ?? `image ${item?.id}`}
        style={{ maxWidth: "100%" }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src="images/noimage.png";
        }}
      />
      <h3>{item.title}</h3>
      <div>
        <MarkdownEditor.Markdown
          source={item.content.replace(/\\n/g, "\n")}
          height="200px"
          rehypeRewrite={(node, index, parent) => {
            if (
              node.tagName === "a" &&
              parent &&
              /^h(1|2|3|4|5|6)/.test(parent.tagName)
            ) {
              parent.children = parent.children.slice(1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImageDescription;
