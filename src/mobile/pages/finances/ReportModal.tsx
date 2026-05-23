import React, { useEffect, useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { FileEarmarkPdf } from "react-bootstrap-icons";
import { FinancesEvent, TicketType, TicketOption } from "./finances.types";
import generateEventPdf from "./generateEventPdf";
import { TxContext } from "./txContext";

type Props = {
  event: FinancesEvent | null;
  onClose: () => void;
  autoPrint?: boolean;
};

export default function ReportModal({ event, onClose, autoPrint }: Props): JSX.Element | null {
  const ctx = useContext(TxContext);
  const [summary, setSummary] = useState<any | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= 640);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch summary when event changes
  useEffect(() => {
    let mounted = true;
    if (!event) return;
    (async () => {
      setLoadingSummary(true);
      try {
        const s = await ctx?.getEventSummary?.(event.id);
        if (!mounted) return;
        setSummary(s ?? null);
      } catch (e) {
        // ignore
        if (mounted) setSummary(null);
      } finally {
        if (mounted) setLoadingSummary(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [event, ctx]);

  // autoPrint -> generate PDF using cached summary when available
  useEffect(() => {
    if (autoPrint && event) {
      (async () => {
        try {
          const s = summary ?? (await ctx?.getEventSummary?.(event.id));
          await generateEventPdf(event, s ?? undefined);
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [autoPrint, event, summary, ctx]);

  if (!event) return null;

  function formatDate(d: string) {
    try {
      const dt = new Date(d);
      return dt.toLocaleString();
    } catch (e) {
      return d;
    }
  }

  function formatCurrency(v?: string | number) {
    if (v === undefined || v === null || v === "") return "R 0.00";
    const n = typeof v === "string" ? parseFloat(v) : Number(v);
    if (Number.isNaN(n)) return String(v);
    return `R ${n.toFixed(2)}`;
  }

  // PDF generation is handled by `generateEventPdf` so modal delegates to it.

  return (
    <div style={{ position: "fixed", left: 0, top: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: "780px", maxWidth: "95%", margin: "36px auto", background: "#fff", padding: 20, borderRadius: 6 }}>
        <div>
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
            {event.price && Number(event.price) !== 0 ? (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="label">Ticket price</div>
                <div className="value">{`R ${event.price}`}</div>
              </div>
            ) : null}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="label">Total revenue:</div>
              <div className="value">{event.total_price ? `R ${event.total_price}` : "R 0"}</div>
            </div>
          </div>

          {/* Ticket Types */}
          {event.ticket_types && event.ticket_types.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Ticket Types</div>
              {isDesktop ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ddd", color: "#555" }}>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Name</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Price</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Sold</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.ticket_types.map((tt: TicketType) => (
                      <tr key={tt.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "4px 8px" }}>{tt.name}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>R {Number(tt.price).toFixed(2)}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>{tt.tickets_sold ?? 0}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>R {Number(tt.total_value ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  {event.ticket_types.map((tt: TicketType) => (
                    <div key={tt.id} style={{ borderBottom: "1px solid #f0f0f0", padding: "6px 0" }}>
                      <div style={{ fontWeight: 600 }}>{tt.name}</div>
                      <div style={{ color: "#555", fontSize: 12 }}>@ R {Number(tt.price).toFixed(2)}, {tt.tickets_sold ?? 0} sold, R {Number(tt.total_value ?? 0).toFixed(2)} total</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Ticket Options */}
          {event.ticket_options && event.ticket_options.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Ticket Options</div>
              {isDesktop ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #ddd", color: "#555" }}>
                      <th style={{ textAlign: "left", padding: "4px 8px" }}>Name</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Price</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Sold</th>
                      <th style={{ textAlign: "right", padding: "4px 8px" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.ticket_options.map((to: TicketOption) => (
                      <tr key={to.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "4px 8px" }}>{to.name}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>R {Number(to.price).toFixed(2)}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>{to.tickets_sold ?? 0}</td>
                        <td style={{ textAlign: "right", padding: "4px 8px" }}>R {Number(to.total_value ?? 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div>
                  {event.ticket_options.map((to: TicketOption) => (
                    <div key={to.id} style={{ borderBottom: "1px solid #f0f0f0", padding: "6px 0" }}>
                      <div style={{ fontWeight: 600 }}>{to.name}</div>
                      <div style={{ color: "#555", fontSize: 12 }}>@ R {Number(to.price).toFixed(2)}, {to.tickets_sold ?? 0} sold, R {Number(to.total_value ?? 0).toFixed(2)} total</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <hr />

          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Payment summary</div>
            {loadingSummary ? (
              <div>Loading summary…</div>
            ) : summary ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="label">Tickets revenue</div>
                  <div className="value">{formatCurrency(summary.total_price ?? event.total_price)}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="label">Platform fee (incl VAT)</div>
                  <div className="value">{formatCurrency(summary.platform_gross_total)}</div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="label">Platform VAT</div>
                  <div className="value">{formatCurrency(summary.platform_tax_total)}</div>
                </div>

                {summary.other_vat && Number(summary.other_vat) !== 0 ? (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="label">Other VAT payable</div>
                    <div className="value">{formatCurrency(summary.other_vat)}</div>
                  </div>
                ) : null}

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <div className="label">Amount to you (incl VAT)</div>
                  <div className="value">{formatCurrency(summary.user_gross_total)}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div className="label">Your VAT</div>
                  <div className="value">{formatCurrency(summary.user_tax_total)}</div>
                </div>
              </div>
            ) : (
              <div>No payment summary available.</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <Button
            variant="primary"
            onClick={async () => {
              if (!event) return;
              try {
                let s = summary;
                if (!s) {
                  setLoadingSummary(true);
                  s = await ctx?.getEventSummary?.(event.id);
                  setSummary(s ?? null);
                  setLoadingSummary(false);
                }
                await generateEventPdf(event, s ?? undefined);
              } catch (e) {
                // ignore
                setLoadingSummary(false);
              }
            }}
          >
            <FileEarmarkPdf />&nbsp;Export PDF
          </Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}
