import React, { useState, useEffect } from "react";
import useTenant from "../tenant/context/usetenant";
import useUser from "../auth/context/useuser";
import ContentDisplay from "./contentdisplay";

const ContentItem = (props) => {
  const { id, as, style, className, customType } = props;
  const [item, setItem] = useState();
  const { user } = useUser();


  useEffect(() => {
    if (!id) {
      console.warn("No content id recieved");
      return;
    }
    fetch(`${process.env.REACT_APP_CONTENT_API}api.php/content/${id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (!data.content) {
          data.content = "";
        }
        if (!data.style) {
          data.style = {};
        } else {
          if (typeof data.style === "string") {
            data.style = JSON.parse(data.style);
          }
        }
        setItem(data);
      });
  }, [id]);

  if (!item) {
    return <div>Loading 2</div>;
  }

  return (
    <ContentDisplay
      {...props}
      as={as}
      item={item}
      user={user}
      style={style}
      className={className}
      customType={customType}
    />
  );
};

export default ContentItem;
