import React, { Suspense } from "react";
import "./fullnewsitem.scss";
import { useNews } from "./newscontext";
import HighlightText, { formattedText } from "./highlighttext";
import { convertToMarkdown } from "../../functions/converttomarkdown";

const Markdown = React.lazy(() => import("react-markdown"));

const FullNewsItem = ({ id }) => {
  const { getNewsById } = useNews();
  const item = getNewsById(id);

  if (!item) {
    return <div>News item not found</div>;
  }

  console.log("convertToMarkdown(item.body)", convertToMarkdown(item.body));

  return (
    <div className="full-news-item">
      {item.image_url && (
        <img src={`http://localhost/files/${item.image_url}`} alt={item.title} className="full-news-image" />
      )}
      <h2>
        <HighlightText text={item.title} />
      </h2>
      <div className="news-footer">
        <span>{item.author}</span>
        <span>{new Date(item.date).toLocaleDateString()}</span>
      </div>
      <p>
        <Suspense>
          <Markdown>{convertToMarkdown(item.body)}</Markdown>
        </Suspense>
        <HighlightText text={item.body} terms={{"juzt.dance": "juztdance", "article": "text-event"}}/>
      </p>
    </div>
  );
};

export default FullNewsItem;
