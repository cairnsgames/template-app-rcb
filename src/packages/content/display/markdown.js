import React from "react";
import useShareData from "../../../hooks/useshare";
import { getImageSrc } from "../getimagesrc";
const MarkdownEditor = React.lazy(() => import("@uiw/react-markdown-editor"));

const Markdown = (props) => {
  const { item, content, style, className } = props;

  const { Share, fileFromUrl } = useShareData(
    item?.title,
    item?.content,
    item?.url
  );

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
  );
};

export default Markdown;
