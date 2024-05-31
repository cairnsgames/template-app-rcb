import React, { useEffect, useState } from "react";
import { InView } from "react-intersection-observer";
import ContentSelector from "./display/contentselector";

const Zharo = ({ itemtype, contentId }) => {
  const [content, setContent] = useState(null);

  const seen = () => {
    let url = `${process.env.REACT_APP_CONTENT_API}/seen.php?type=${itemtype}&id=${contentId}`;
    url = url.replace(/#/g, "%23");

    // Fire and forget
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    const apiEndpoint = `${process.env.REACT_APP_CONTENT_API}/api.php/zharo/${contentId}`;

    fetch(apiEndpoint)
      .then((response) => response.json())
      .then((data) => setContent(data))
      .catch((error) => console.error("Error fetching content:", error));
  }, [contentId]);

  if (!content) {
    return <div>Loading...</div>;
  }

  return (
    <InView
      className="content-container"
      style={{ position: "relative" }}
      key={contentId}
      onChange={(inView, entry) => {
        if (inView && contentId) {
          seen();
        }
      }}
    >
      <ContentSelector item={content} />
    </InView>
  );
};

export default Zharo;
