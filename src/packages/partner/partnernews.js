import React from 'react';

function PartnerNews({ items = [], open = true, toggle = () => {} }) {
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
        {hasItems ? (
          <ul className="pd-list">
            {items.map(n => (
              <li key={n?.id || n?.title || Math.random()} className="pd-item">
                <strong>{n.title || n.name || 'News item'}</strong>
                <div className="pd-item__meta">{n.excerpt || n.summary || ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pagePartnerDetail__placeholder">No news published yet.</div>
        )}
      </div>
    </div>
  );
}

export default PartnerNews;
