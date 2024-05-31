import React, { Suspense } from "react";
import ImageOnly from "./imageonly";
import VideoOnly from "./videoonly";
import PlainText from "./plaintext";
import OverlayCard from "./overlaycard";
import Link from "./link";
import ImageDescription from "./imagedescription";
import { getImageSrc } from "../getimagesrc";

const Markdown = React.lazy(() => import("./markdown"));

const ContentSelector = (props) => {
  const { as, item } = props;
  return (
    <div>
      {(as ?? item?.type) === 1 && <ImageOnly {...props} item={item} />}
      {item?.type === 2 && <VideoOnly {...props} />}
      {(as ?? item?.type) === 3 && <PlainText {...props} />}
      {(as ?? item?.type) === 4 && (
        <OverlayCard
          itemtype="content"
          id={item.id}
          title={item.title}
          src={getImageSrc(item?.url)}
          style={{ ...item.style }}
          className
        />
      )}
      {(item?.type === 5 || item?.type === 6) && (
        <Suspense fallback={<div>Loading...</div>}>
          <Markdown {...props} item={item} />
        </Suspense>
      )}
      {item?.type === 7 && <Link {...props} />}
      {(as ?? item?.type) === 8 && <ImageDescription {...props} item={item} />}
    </div>
  );
};

export default ContentSelector;
