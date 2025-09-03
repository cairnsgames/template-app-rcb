import React from 'react';
import { Image } from 'react-bootstrap';

const KlokoImage = ({ event }) => {
  const isFullUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const imageUrl = event.avatar
    ? isFullUrl(event.avatar)
      ? event.avatar
      : `https://cairnsgames.co.za/files/${event.avatar}`
    : `https://cairnsgames.co.za/files/1.png`;

  return <Image style={{ width: "100%", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }} src={imageUrl} />;
};

export default KlokoImage;
