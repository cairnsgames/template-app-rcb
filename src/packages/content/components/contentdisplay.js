import React, { useState, useEffect } from "react";
import OverlayCard from "./overlaycard";
import MarkdownEditor from "@uiw/react-markdown-editor";
import useTenant from "../../tenant/context/usetenant";
import useUser from "../../auth/context/useuser";
import Tracker from "../../tracker/tracker";
import Layout from "./layout";
import useShareData from "../../tracker/useshare";

const ContentDisplay = (props) => {
  const {
    item,
    setItem,
    content,
    setContent,
    contentType,
    user,
    style,
    className,
  } = props;
  const { Share, fileFromUrl } = useShareData(item?.title, item?.content, item?.url);

  return (
    <Tracker itemtype="content" id={props.id}>
      {item?.type === 1 && (
        <img
          className={className}
          style={style}
          src={`${process.env.REACT_APP_FILES}${item?.url}`}
          alt={item?.title ?? `image ${id}`}
        />
      )}
      {item?.type === 2 && (
        <video controls className={className} style={style}>
          <source src={`${process.env.REACT_APP_FILES}${item?.url}`} />
        </video>
      )}
      {item?.type === 3 && (
        <div className={className} style={style}>
          <h3>
            {item.title}
            <Share item={{...item, files: [fileFromUrl(item.url)]}} className="float-end" />
          </h3>
          <div>{item.content}</div>
        </div>
      )}
      {item?.type === 4 && (
        <OverlayCard
          itemtype="content"
          id={item.id}
          title={item.title}
          src={`${process.env.REACT_APP_FILES}${item?.url}`}
        />
      )}
      {item?.type === 5 && (
        <MarkdownEditor.Markdown
          source={content.replace(/\\n/g, "\n")}
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
      )}
      {item?.type === 6 && (
        <MarkdownEditor
          value={item?.content.replace(/\\n/g, "\n")}
          height="200px"
          onChange={(value, viewUpdate) => {
            setContent(value);
          }}
        />
      )}
      {item?.type === 7 && <a href={item?.url}>{item.title}</a>}
      {item?.type === 8 && (
        <div className={className} style={style}>
          <img
            className={className}
            style={style}
            src={`${process.env.REACT_APP_FILES}${item?.url}`}
            alt={item?.title ?? `image ${id}`}
          />
          <h3>{item.title}</h3>
          <div>{item.content}</div>
        </div>
      )}
      {item?.type === 99 && <Layout props={props} />}
    </Tracker>
  );
};

export default ContentDisplay;
