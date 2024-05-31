import React from "react";

const Link = (props) => {
  const { item, content, style, className } = props;

  if (!item) return <div>Loading</div>;

  return (
    <a href={item?.url}>{item.title}</a>
  );
};

export default Link;
