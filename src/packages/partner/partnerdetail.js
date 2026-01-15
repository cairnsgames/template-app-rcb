import React, { useEffect, useState } from "react";
import { usePartner } from "./context/partnercontext";
import "./partnerdetail.scss";
import PartnerBio from "./partnerbio";
import PartnerNews from "./partnernews";
import PartnerEvents from "./partnerevents";
import PartnerClasses from "./partnerclasses";

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

    console.log("AAAA PartnerDetail activePartner:", activePartner);

  // Helper to read named properties from the partner's `properties` array.
  // Usage: getProperty(partner, 'phone', defaultValue)
  const getProperty = (partner, name, defaultValue = null) => {
    if (!partner) return defaultValue;
    const props = Array.isArray(partner.properties) ? partner.properties : [];
    const prop = props.find((p) => p && (p.name === name || String(p.id) === String(name)));
    if (prop && (prop.value !== undefined && prop.value !== null)) {
      return typeof prop.value === "string" ? prop.value.trim() : prop.value;
    }
    return defaultValue;
  };


  useEffect(() => {
    if (partnerId) {
      setActivePartnerId(partnerId);
    }
  }, [partnerId, setActivePartnerId]);

  const [openSections, setOpenSections] = useState({ news: true, events: false, classes: false });

  const toggle = (key) => {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  };

  if (!partnerId) {
    return <div className="partner-detail"><h2>Partner Detail</h2><p>No partner id provided.</p></div>;
  }

  if (!activePartner) {
    return <div className="partner-detail"><h2>Partner Detail</h2><p>Loading partner...</p></div>;
  }

  const fullName = `${activePartner.firstname || ""} ${activePartner.lastname || ""}`.trim();

  return (
    <div className="pagePartnerDetail">
      <div className="pagePartnerDetail__header">
        <h2>{fullName || activePartner.username || "Profile"}</h2>
      </div>

      <div className="pagePartnerDetail__wrap">
        <aside className="pagePartnerDetail__card">
          {activePartner.avatar ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img className="pagePartnerDetail__image" src={activePartner.avatar} alt={`Avatar of ${fullName}`} />
          ) : (
            <div className="pagePartnerDetail__image pagePartnerDetail__image--placeholder">No Image</div>
          )}

          <div className="pagePartnerDetail__info">
            <div><strong>Name:</strong> {fullName || "N/A"}</div>
            <div><strong>Email:</strong> {activePartner.email || "N/A"}</div>
            <div><strong>Location:</strong> {activePartner.location_name || "N/A"} {activePartner.distance ? `• ${activePartner.distance} km from you` : ""}</div>
            <div><strong>Phone:</strong> {getProperty(activePartner, 'phone', activePartner.phone) || "N/A"}</div>
            <div><strong>Roles:</strong> {Array.isArray(activePartner.roles) ? activePartner.roles.map(r => r && r.name ? r.name : r).join(', ') : 'N/A'}</div>
          </div>

          <div className="pagePartnerDetail__offerings">
            <h4>Offerings</h4>
            {Array.isArray(activePartner.offerings) && activePartner.offerings.length > 0 ? (
              activePartner.offerings.map(o => (
                <span key={o?.id || o?.name || Math.random()} className="pagePartnerDetail__tag">{o.name || o}</span>
              ))
            ) : (
              <div className="pagePartnerDetail__placeholder">No offerings listed.</div>
            )}
          </div>
        </aside>

        <main className="pagePartnerDetail__content">
          <PartnerBio bio={activePartner.bio || activePartner.description} />
          <PartnerNews items={news} open={openSections.news} toggle={toggle} />
          <PartnerEvents items={events} open={openSections.events} toggle={toggle} />
          <PartnerClasses items={classes} open={openSections.classes} toggle={toggle} />
        </main>
      </div>
    </div>
  );
}

export default PartnerDetail;
