import React, { Suspense } from "react";
import "./fullnewsitem.scss";
import { useNews } from "./context/newscontext";
import HighlightText, { formattedText } from "../../components/highlighttext";
import { convertToMarkdown } from "../../functions/converttomarkdown";
import { combineUrlAndPath } from "../../functions/combineurlandpath";
import Tracker from "../tracker/tracker";

const Markdown = React.lazy(() => import("react-markdown"));

const FullNewsItem = ({ id }) => {
  const { getNewsById } = useNews();
  const item = getNewsById(id);

  if (!item) {
    return <div>News item not found</div>;
  }

  console.log("convertToMarkdown(item.body)", convertToMarkdown(item.body));

  return (
    <Tracker itemtype="news.detail" id={id}>
    
    <div className="full-news-item">
      {item.image_url && (
        <img src={combineUrlAndPath(process.env.REACT_APP_FILES,`${item.image_url}`)} alt={item.title} className="full-news-image" 
        style={{maxHeight: "70vh", objectFit: 'contain' }}/>
      )}
      <h2>
        <HighlightText text={item.title} />
      </h2>
      <div className="news-footer">
        <span>{item.author} {item.phone ? <span>({item.phone})</span> : null}</span>
        <span>{new Date(item.date).toLocaleDateString()}</span>
      </div>
      <p>
        {/* <Suspense>
          <Markdown>{convertToMarkdown(item.body)}</Markdown>
        </Suspense> */}
        <HighlightText text={item.body} terms={{"juzt.dance": "juztdance", "article": "text-event"}}/>
      </p>
    </div>
    </Tracker>
  );
};

export default FullNewsItem;
