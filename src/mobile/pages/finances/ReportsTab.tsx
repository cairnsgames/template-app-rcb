import React, { useContext, useMemo, useState } from "react";
import { TxContext } from "./txContext";
import ReportModal from "./ReportModal";
import { FinancesEvent } from "./finances.types";
import { Button, Form, Row, Col } from "react-bootstrap";
import { Eye, FileEarmarkPdf } from "react-bootstrap-icons";
import generateEventPdf from "./generateEventPdf";

function toDateInputValue(d: Date) {
  return d.toISOString().split("T")[0];
}

const defaultStart = toDateInputValue(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000));

export default function ReportsTab(): JSX.Element {
  const ctx = useContext(TxContext);
  const events = ctx?.events ?? [];
  const loading = ctx?.loadingEvents ?? false;

  const [selected, setSelected] = useState<FinancesEvent | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);
  const [filterFrom, setFilterFrom] = useState(defaultStart);
  const [withSalesOnly, setWithSalesOnly] = useState(false);

  function isPast(endTime: string | undefined | null) {
    if (!endTime) return false;
    const dt = new Date(endTime);
    return dt.getTime() < Date.now();
  }

  function openAndMaybePrint(ev: FinancesEvent, doPrint = false) {
    setSelected(ev);
    setAutoPrint(doPrint);
  }

  function closeModal() {
    setSelected(null);
    setAutoPrint(false);
  }

  const listItems = useMemo(() => {
    const since = filterFrom ? new Date(filterFrom).getTime() : null;
    const now = Date.now();
    return (events as FinancesEvent[]).filter((ev) => {
      const evTime = new Date(ev.start_time || "").getTime();
      // future events always show; only filter past events by the "since" date
      const isFuture = evTime >= now;
      if (!isFuture && since && evTime < since) return false;
      if (withSalesOnly && !(ev.tickets_sold && ev.tickets_sold > 0)) return false;
      return true;
    });
  }, [events, filterFrom, withSalesOnly]);

  return (
    <div>
      <h4>Reports</h4>

      <Row className="g-2 align-items-end mb-3">
        <Col xs={12} sm="auto">
          <Form.Group controlId="filterFrom">
            <Form.Label className="mb-1" style={{ fontSize: 12 }}>Since</Form.Label>
            <Form.Control
              type="date"
              size="sm"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs={12} sm className="d-flex align-items-end justify-content-sm-end">
          <Form.Check
            type="switch"
            id="withSalesOnly"
            label="With sales only"
            checked={withSalesOnly}
            onChange={(e) => setWithSalesOnly(e.target.checked)}
          />
        </Col>
      </Row>

      {loading ? <div>Loading events…</div> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {listItems.map((ev: FinancesEvent) => {
          const past = isPast(ev.end_time || ev.start_time);
          return (
            <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, background: past ? "#f4e7fb" : "#fff", border: "1px solid #eee", borderRadius: 6 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{ev.title}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{ev.start_time}</div>
                <div style={{ fontSize: 12, color: "#666" }}>Days displayed: {ev.days_displayed ?? "-"} • Views: {ev.detail_total_views ?? ev.card_total_views ?? 0}</div>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ textAlign: "right", fontSize: 14 }}>
                  <div>Tickets: {ev.tickets_sold ?? 0}</div>
                  <div>Total: R {ev.total_price ?? 0}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Button variant="light" size="sm" title="View" onClick={() => openAndMaybePrint(ev, false)}>
                    <Eye />
                  </Button>
                  {isPast(ev.end_time || ev.start_time) ? (
                    <Button
                      variant="outline-primary"
                      size="sm"
                      title="Export PDF"
                      onClick={() => generateEventPdf(ev)}
                    >
                      <FileEarmarkPdf />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selected ? <ReportModal event={selected} onClose={closeModal} autoPrint={autoPrint} /> : null}
    </div>
  );
}
