import React, { useContext, useMemo, useState } from "react";
import { TxContext } from "./txContext";
import ReportModal from "./ReportModal";
import { Button } from "react-bootstrap";
import { Eye, Printer } from "react-bootstrap-icons";

export default function ReportsTab(): JSX.Element {
  const ctx = useContext(TxContext as any);
  const events = ctx?.events ?? [];
  const loading = ctx?.loadingEvents ?? false;

  const [selected, setSelected] = useState<any | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  function isPast(endTime: string | undefined | null) {
    if (!endTime) return false;
    const dt = new Date(endTime);
    return dt.getTime() < Date.now();
  }

  function openAndMaybePrint(ev: any, doPrint = false) {
    setSelected(ev);
    setAutoPrint(doPrint);
  }

  function closeModal() {
    setSelected(null);
    setAutoPrint(false);
  }

  const listItems = useMemo(() => events || [], [events]);

  return (
    <div>
      <h4>Reports</h4>
      {loading ? <div>Loading events…</div> : null}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
        {listItems.map((ev: any) => {
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
                    <Button variant="outline-primary" size="sm" title="Print" onClick={() => openAndMaybePrint(ev, true)}>
                      <Printer />
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
