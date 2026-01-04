import React from "react";
import { useNews } from "./context/newscontext";
import NewsItem from "./newsitem";
import NewsThumb from "./newsthumb";
import "./news.scss";
import NewsCard from "./newscard";
import Tracker from "../tracker/tracker";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import LocationSearch from "../../external/LocationSearch";
import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";

const NewsDisplay = ({ item, onClick, layout }) => {
  if (layout === "card") {
    return <NewsCard item={item} onClick={onClick} />;
  }
  if (layout === "thumb") {
    return <NewsThumb item={item} onClick={onClick} />;
  }
  return (
    <Tile>
      <Tracker itemtype="news.card" id={item.id}>
        <NewsItem key={item.id} item={item} onClick={onClick} />
      </Tracker>
    </Tile>
  );
};

export const NewsItems = ({ count, layout, onClick }) => {
  const { newsItems } = useNews();
  const items = newsItems.slice(0, count);

  console.log("News Items in NewsItems:", newsItems);

  return (
    <>
      <TilesLayout>
        {items.map((item) => {
          return (
            <NewsDisplay
              key={item.id}
              item={item}
              layout={layout}
              onClick={onClick}
            />
          );
        })}
      </TilesLayout>
    </>
  );
};

const News = ({ layout = "default", items = 99999 }) => {
  const { t } = useTranslation();
  const { newsItems, setLocation } = useNews();

  const handleItemClick = (id) => {
    window.location.hash = `#news/${id}`;
  };

  console.log("News Items:", newsItems);
  return (
    <Tracker itemtype="news" id={"page"}>
      <div className="news pakagesNews">
        <div className="text-center">
          <h3>{t("news.latestNews")}</h3>
        </div>
        <Row className="mb-3">
          <Col xs={12} md={12} className="my-2">
            <LocationSearch onSelected={setLocation} />
          </Col>
        </Row>
        <NewsItems items={items} layout={layout} onClick={handleItemClick} />
      </div>
    </Tracker>
  );
};

export default News;
