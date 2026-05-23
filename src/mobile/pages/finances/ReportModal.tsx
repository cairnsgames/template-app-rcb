import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FileEarmarkPdf } from "react-bootstrap-icons";
import { FinancesEvent, TicketType, TicketOption } from "./finances.types";
import generateEventPdf from "./generateEventPdf";
import "./ReportModal.css";

type Props = {
  event: FinancesEvent | null;
  onClose: () => void;
  autoPrint?: boolean;
};

export default function ReportModal({ event, onClose, autoPrint }: Props): JSX.Element | null {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // autoPrint -> generate PDF
  useEffect(() => {
    if (autoPrint && event) {
      generateEventPdf(event).catch(() => {/* ignore */});
    }
  }, [autoPrint, event]);

  if (!event) return null;

  function formatDate(d: string) {
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch (e) {
      return d;
    }
  }

  // PDF generation is handled by `generateEventPdf` so modal delegates to it.

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="report-modal-container">
        <div>
          <div className="report-modal-header">
            <div className="report-modal-header-text">
              <div className="report-modal-subtitle">Event Feedback</div>
              <div className="report-modal-title">{event.title}</div>
              <div className="report-modal-dates">{formatDate(event.start_time)} - {formatDate(event.end_time || event.start_time)}</div>
            </div>
            <div>
              {event.image ? (
                <img
                  alt="event"
                  src={`https://cairnsgames.co.za/files/${event.image}`}
                  className="report-modal-image"
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
            <div className="report-modal-stat-row">
              <div className="label">Days displayed</div>
              <div className="value">{event.days_displayed ?? "-"}</div>
            </div>
            <div className="report-modal-stat-row">
              <div className="label">Total views:</div>
              <div className="value">{event.detail_total_views ?? event.card_total_views ?? 0}</div>
            </div>
            <div className="report-modal-stat-row">
              <div className="label">Conversion Rate:</div>
              <div className="value">{event.conversion_rate ?? "-"}</div>
            </div>
            <div className="report-modal-stat-row">
              <div className="label">Tickets bought</div>
              <div className="value">{event.tickets_sold ?? 0}</div>
            </div>
            {event.price && Number(event.price) !== 0 ? (
              <div className="report-modal-stat-row">
                <div className="label">Ticket price</div>
                <div className="value">{`R ${event.price}`}</div>
              </div>
            ) : null}
            <div className="report-modal-stat-row">
              <div className="label">Total revenue:</div>
              <div className="value">{event.total_price ? `R ${event.total_price}` : "R 0"}</div>
            </div>
          </div>

          {/* Ticket Types */}
          {event.ticket_types && event.ticket_types.length > 0 && (
            <div className="report-modal-section-ticket">
              <div className="report-modal-section-heading">Ticket Types</div>
              {isDesktop ? (
                <table className="report-modal-ticket-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Sold</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.ticket_types.map((tt: TicketType) => (
                      <tr key={tt.id}>
                        <td>{tt.name}</td>
                        <td>R {Number(tt.price).toFixed(2)}</td>
                        <td>{tt.tickets_sold ?? 0}</td>
                        <td>R {Number(tt.total_value ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  {event.ticket_types.map((tt: TicketType) => (
                    <div key={tt.id} className="report-modal-ticket-mobile-row">
                      <div className="report-modal-ticket-mobile-name">{tt.name}</div>
                      <div className="report-modal-ticket-mobile-detail">@ R {Number(tt.price).toFixed(2)}, {tt.tickets_sold ?? 0} sold, R {Number(tt.total_value ?? 0).toFixed(2)} total</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ticket Options */}
          {event.ticket_options && event.ticket_options.length > 0 && (
            <div className="report-modal-section-ticket">
              <div className="report-modal-section-heading">Ticket Options</div>
              {isDesktop ? (
                <table className="report-modal-ticket-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Sold</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.ticket_options.map((to: TicketOption) => (
                      <tr key={to.id}>
                        <td>{to.name}</td>
                        <td>R {Number(to.price).toFixed(2)}</td>
                        <td>{to.tickets_sold ?? 0}</td>
                        <td>R {Number(to.total_value ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  {event.ticket_options.map((to: TicketOption) => (
                    <div key={to.id} className="report-modal-ticket-mobile-row">
                      <div className="report-modal-ticket-mobile-name">{to.name}</div>
                      <div className="report-modal-ticket-mobile-detail">@ R {Number(to.price).toFixed(2)}, {to.tickets_sold ?? 0} sold, R {Number(to.total_value ?? 0).toFixed(2)} total</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="report-modal-actions">
          <Button
            variant="primary"
            onClick={() => generateEventPdf(event).catch(() => {/* ignore */})}
          >
            <FileEarmarkPdf />&nbsp;Export PDF
          </Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
