import React, { useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { Printer } from "react-bootstrap-icons";

type Props = {
  event: any;
  onClose: () => void;
  autoPrint?: boolean;
};

export default function ReportModal({ event, onClose, autoPrint }: Props): JSX.Element | null {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoPrint) {
      // give time to render
      setTimeout(() => {
        handlePrint();
      }, 300);
    }
  }, [autoPrint]);

  if (!event) return null;

  function formatDate(d: string) {
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch (e) {
      return d;
    }
  }

  function buildHtmlForPrint() {
    const styles = `
      body { font-family: Arial, Helvetica, sans-serif; color: #333; }
      .header { text-align: center; margin-bottom: 12px }
      .title { font-size: 28px; color: #7d2b72 }
      .section { margin: 8px 0 }
      .row { display:flex; justify-content:space-between; padding:6px 0 }
      .label { color: #666 }
      .value { font-weight:600 }
    `;
    const content = ref.current ? ref.current.innerHTML : "";
    return `<html><head><style>${styles}</style></head><body>${content}</body></html>`;
  }

  function handlePrint() {
    const html = buildHtmlForPrint();
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      w.print();
    }, 300);
  }

  return (
    <div style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "780px", maxWidth: "95%", margin: "36px auto", background: "#fff", padding: 20, borderRadius: 6 }}>
        <div ref={ref}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, color: "#7d2b72" }}>Event Feedback</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{event.title}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{formatDate(event.start_time)} - {formatDate(event.end_time || event.start_time)}</div>
            </div>
            <div>
              {event.image ? (
                <img
                  alt="event"
                  src={`https://cairnsgames.co.za/files/${event.image}`}
                  style={{ maxWidth: 120, maxHeight: 120 }}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                  }}
                />
              ) : null}
            </div>
          </div>

          <hr />

          <div className="section">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Days displayed</div>
              <div className="value">{event.days_displayed ?? "-"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Total views:</div>
              <div className="value">{event.detail_total_views ?? event.card_total_views ?? 0}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Conversion Rate:</div>
              <div className="value">{event.conversion_rate ?? "-"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Tickets bought</div>
              <div className="value">{event.tickets_sold ?? 0}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Ticket price</div>
              <div className="value">{event.price ? `R ${event.price}` : "R 0"}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Total revenue:</div>
              <div className="value">{event.total_price ? `R ${event.total_price}` : "R 0"}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <Button variant="primary" onClick={handlePrint}>
            <Printer />&nbsp;Print / Export PDF
          </Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
