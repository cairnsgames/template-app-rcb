import React, { useState, useEffect } from "react";
import OverlayCard from "./overlaycard";
import MarkdownEditor from "@uiw/react-markdown-editor";
import useTenant from "../../tenant/context/usetenant";
import useUser from "../../auth/context/useuser";
import Tracker from "../../tracker/tracker";
import ContentDisplay from "./contentdisplay";

/* Item Types
    1. Image
    2. Video
    3. Content
    4. Overlay Card
    5. Markdown View
    6. Editable Markdown
    7. Link
*/

const ContentItem = (props) => {
  const { id, style, className } = props;
  const [item, setItem] = useState();
  const [content, setContent] = useState();
  const { tenant } = useTenant();
  const { user, token } = useUser();

  const contentType = (type) => {
    switch (type) {
      case 1:
        return "Image";
      case 2:
        return "Video";
      case 3:
        return "Content";
      case 4:
        return "Overlay Card";
      case 5:
        return "Markdown View";
      case 6:
        return "Editable Markdown";
      case 7:
        return "Link";
      case 8:
        return "Image and Description";
      case 99:
        return "Layout";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_CONTENT_API}api.php/content/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setItem(data);
        setContent(data.content);
      });
  }, [id]);

  const saveContent = (newItem) => {
    fetch(`${process.env.REACT_APP_CONTENT_API}api.php/content/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        APP_ID: tenant,
        token: token,
      },
      body: JSON.stringify(newItem),
    });
  };

  useEffect(() => {
    if (!content || content === item?.content) {
      return;
    }
    const timeoutId = setTimeout(() => {
      saveContent({ ...item, content: content.replace(/\\n/g, "\n") });
    }, 2000);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [content]);

  useEffect(() => {
    console.log("Content Item", content);
  }, [content]);

  return (
    <>
      <ContentDisplay
        {...props}
        item={item}
        user={user}
        content={content}
        contentType={contentType}
        setContent={setContent}
      />
    </>
  );
};

export default ContentItem;
