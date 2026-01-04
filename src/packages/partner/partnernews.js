import React from 'react';
import NewsItem from "../news/newsitem";
import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";
import Tracker from "../tracker/tracker";

function PartnerNews({ items = [], open = true, toggle = () => {}, onClick = null }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const isOpen = hasItems ? open : true; // expand when empty

  return (
    <div className={`pd-section pd-news ${isOpen ? 'open' : 'closed'}`}>
      <div className="pd-section__header">
        <h3>News</h3>
        {hasItems ? (
          <button
            className="pd-toggle"
            onClick={() => toggle('news')}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide' : 'Click to see'}
          </button>
        ) : null}
      </div>

      <div className="pd-section__body">
        {hasItems && isOpen ? (
          <TilesLayout>
            {items.map((item) => (
              <Tile key={item?.id || item?.title || Math.random()}>
                <Tracker itemtype="news.card" id={item.id}>
                  <NewsItem key={item.id} item={item} onClick={onClick} />
                </Tracker>
              </Tile>
            ))}
          </TilesLayout>
        ) : (
          <div className="pagePartnerDetail__placeholder">No news published yet.</div>
        )}
      </div>
    </div>
  );
}

export default PartnerNews;
