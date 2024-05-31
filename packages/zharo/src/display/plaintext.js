import React from "react";

const PlainText = (props) => {
  const { item, style, className } = props;

  if (!item) return <div>Loading</div>;

  return (
    <div className={`${className} plain-text`} style={{...style, maxWidth:"100%"}}>
    <h3>
      {item.title}
    </h3>
    <div>{item.content}</div>
  </div>
  );
};

export default PlainText;
