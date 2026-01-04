import React, { useEffect } from "react";
import { usePartner } from "./context/partnercontext";

function PartnerDetail(props) {
  const { match, id } = props;
  const partnerId = match?.params?.id ?? id ?? props?.id ?? null;
  const {
    setActivePartnerId,
    activePartner,
    classes,
    events,
    news,
  } = usePartner();

  useEffect(() => {
    if (partnerId) {
      setActivePartnerId(partnerId);
    }
  }, [partnerId, setActivePartnerId]);

  const styles = {
    container: { display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" },
    card: { flex: "0 0 320px", padding: 16, border: "1px solid #eee", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
    content: { flex: 1, minWidth: 280 },
    avatar: { width: "100%", height: 200, objectFit: "cover", borderRadius: 6, background: "#f6f6f6" },
    offeringTag: { display: "inline-block", padding: "6px 10px", margin: "6px 6px 0 0", background: "#eef6ff", color: "#0366d6", borderRadius: 16, fontSize: 13 },
    section: { marginBottom: 16, padding: 12, border: "1px solid #f1f1f1", borderRadius: 6, background: "#fff" },
    sectionTitle: { margin: 0, marginBottom: 8, fontSize: 16, fontWeight: 600 },
    placeholder: { color: "#777", fontStyle: "italic" },
    infoRow: { marginBottom: 8 }
  };

  if (!partnerId) {
    return <div className="partner-detail"><h2>Partner Detail</h2><p>No partner id provided.</p></div>;
  }

  if (!activePartner) {
    return <div className="partner-detail"><h2>Partner Detail</h2><p>Loading partner...</p></div>;
  }

  const fullName = `${activePartner.firstname || ""} ${activePartner.lastname || ""}`.trim();

  return (
    <div className="partner-detail" style={{ padding: 12 }}>
      <h2 style={{ marginTop: 0 }}>Partner: {fullName || activePartner.username || "Profile"}</h2>
      <div style={styles.container}>
        <aside style={styles.card}>
          {activePartner.avatar ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={activePartner.avatar} alt={`Avatar of ${fullName}`} style={styles.avatar} />
          ) : (
            <div style={{ ...styles.avatar, display: "flex", alignItems: "center", justifyContent: "center" }}>No Image</div>
          )}

          <div style={{ marginTop: 12 }}>
            <div style={styles.infoRow}><strong>Name:</strong> {fullName || "N/A"}</div>
            <div style={styles.infoRow}><strong>Email:</strong> {activePartner.email || "N/A"}</div>
            <div style={styles.infoRow}><strong>Location:</strong> {activePartner.location_name || "N/A"} {activePartner.distance ? `• ${activePartner.distance} km` : ""}</div>
            <div style={styles.infoRow}><strong>Roles:</strong> {Array.isArray(activePartner.roles) ? activePartner.roles.map(r => r && r.name ? r.name : r).join(', ') : 'N/A'}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <h4 style={{ margin: '8px 0' }}>Offerings</h4>
            {Array.isArray(activePartner.offerings) && activePartner.offerings.length > 0 ? (
              activePartner.offerings.map(o => (
                <span key={o?.id || o?.name || Math.random()} style={styles.offeringTag}>{o.name || o}</span>
              ))
            ) : (
              <div style={styles.placeholder}>No offerings listed.</div>
            )}
          </div>
        </aside>

        <main style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>About</h3>
            <div>{activePartner.bio || activePartner.description || <span style={styles.placeholder}>No description available.</span>}</div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Classes</h3>
            {Array.isArray(classes) && classes.length > 0 ? (
              <ul>
                {classes.map(c => (
                  <li key={c?.id || c?.name || Math.random()}>
                    <strong>{c.name || c.title || 'Class'}</strong>
                    {c.date ? ` • ${c.date}` : ''}
                    {c.location ? ` • ${c.location}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.placeholder}>No classes available yet.</div>
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Events</h3>
            {Array.isArray(events) && events.length > 0 ? (
              <ul>
                {events.map(e => (
                  <li key={e?.id || e?.name || Math.random()}>
                    <strong>{e.name || e.title || 'Event'}</strong>
                    {e.date ? ` • ${e.date}` : ''}
                    {e.location ? ` • ${e.location}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.placeholder}>No events listed.</div>
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>News</h3>
            {Array.isArray(news) && news.length > 0 ? (
              <ul>
                {news.map(n => (
                  <li key={n?.id || n?.title || Math.random()}>
                    <strong>{n.title || n.name || 'News item'}</strong>
                    <div style={{ fontSize: 13, color: '#555' }}>{n.excerpt || n.summary || ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={styles.placeholder}>No news published yet.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PartnerDetail;
