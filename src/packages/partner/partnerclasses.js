import React from 'react';

function PartnerClasses({ items = [], open = false, toggle = () => {} }) {
  const hasItems = Array.isArray(items) && items.length > 0;
  const isOpen = hasItems ? open : true; // expand when empty

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
        {hasItems ? (
          <ul className="pd-list">
            {items.map(c => (
              <li key={c?.id || c?.name || Math.random()} className="pd-item">
                <strong>{c.name || c.title || 'Class'}</strong>
                <div className="pd-item__meta">{c.date ? `${c.date}` : ''} {c.location ? `• ${c.location}` : ''}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="pagePartnerDetail__placeholder">No classes available yet.</div>
        )}
      </div>
    </div>
  );
}

export default PartnerClasses;
