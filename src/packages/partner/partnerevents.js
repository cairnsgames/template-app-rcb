import React from 'react';

function PartnerEvents({ items = [], open = false, toggle = () => {} }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const isOpen = hasItems ? open : true; // expand when empty

  return (
    <div className={`pd-section pd-events ${isOpen ? 'open' : 'closed'}`}>
      <div className="pd-section__header">
        <h3>Events</h3>
        {hasItems ? (
          <button
            className="pd-toggle"
            onClick={() => toggle('events')}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide' : 'Click to see'}
          </button>
        ) : null}
      </div>

      <div className="pd-section__body">
        {hasItems ? (
          <ul className="pd-list">
            {items.map(e => (
              <li key={e?.id || e?.name || Math.random()} className="pd-item">
                <strong>{e.name || e.title || 'Event'}</strong>
                <div className="pd-item__meta">{e.date ? `${e.date}` : ''} {e.location ? `• ${e.location}` : ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pagePartnerDetail__placeholder">No events listed.</div>
        )}
      </div>
    </div>
  );
}

export default PartnerEvents;
