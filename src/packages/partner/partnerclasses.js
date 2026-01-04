import React, { useMemo, useState } from 'react';
import EventItem from "../kloko/eventitem";

import TilesLayout from "../layout/Tiles";
import Tile from "../layout/Tile";

function PartnerClasses({ items = [], open = false, toggle = () => {}, onEventClick = null }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const isOpen = hasItems ? open : true; // expand when empty

  const [search, setSearch] = useState('');
  const [showOld, setShowOld] = useState(false);

  const handleEventClick = (eventId) => {
    console.log("Click on Event", eventId);
    window.location.hash = `#events/${eventId}`;
    if (typeof onEventClick === 'function') {
      onEventClick(eventId);
    }
  };

  const filteredItems = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    const now = new Date();
    let list = Array.isArray(items) ? items.slice() : [];

    if (!showOld) {
      list = list.filter((item) => {
        const dt = item?.start_time ?? item?.start_date ?? item?.date;
        if (!dt) return true;
        const d = new Date(dt);
        if (isNaN(d)) return true;
        return d > now;
      });
    }

    if (q) {
      list = list.filter((item) => {
        const keywords = Array.isArray(item?.keywords) ? item.keywords.join(' ') : item?.keywords;
        const hay = [item?.title, item?.name, item?.description, item?.body, keywords].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  }, [items, search, showOld]);

  return (
    <div className={`pd-section pd-classes ${isOpen ? 'open' : 'closed'}`}>
      <div className="pd-section__header">
        <h3>Classes</h3>
        {hasItems ? (
          <button
            className="pd-toggle"
            onClick={() => toggle('classes')}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide' : 'Click to see'}
          </button>
        ) : null}
      </div>

      <div className="pd-section__body">
        {hasItems && isOpen ? (
          <div className="pd-section__controls d-flex align-items-center gap-2 mb-2">
            <input
              type="search"
              className="form-control form-control-sm"
              placeholder="Search title or description"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <label style={{display:'flex',alignItems:'center',gap:6}}>
              <input type="checkbox" checked={showOld} onChange={(e) => setShowOld(e.target.checked)} />
              <span style={{marginLeft:6}}>Show old</span>
            </label>
          </div>
        ) : null}

        {hasItems ? (
          (filteredItems && filteredItems.length > 0) ? (
            <TilesLayout>
              {filteredItems.map(item => (
                <Tile key={item?.id || item?.name || Math.random()}>
                  <EventItem item={item} onClick={handleEventClick} />
                </Tile>
              ))}
            </TilesLayout>
          ) : (
            <div className="pagePartnerDetail__placeholder">No classes match your search.</div>
          )
        ) : (
          <div className="pagePartnerDetail__placeholder">No classes available yet.</div>
        )}
      </div>
    </div>
  );
}

export default PartnerClasses;
