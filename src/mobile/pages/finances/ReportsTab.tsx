import React, { useContext, useMemo, useState } from "react";
import { TxContext } from "./txContext";
import ReportModal from "./ReportModal";
import { FinancesEvent } from "./finances.types";
import { Button } from "react-bootstrap";
import { Eye, FileEarmarkPdf } from "react-bootstrap-icons";
import generateEventPdf from "./generateEventPdf";

export default function ReportsTab(): JSX.Element {
  const ctx = useContext(TxContext);
  const events = ctx?.events ?? [];
  const loading = ctx?.loadingEvents ?? false;

  const [selected, setSelected] = useState<FinancesEvent | null>(null);
  const [autoPrint, setAutoPrint] = useState(false);

  function isPast(endTime: string | undefined | null) {
    if (!endTime) return false;
    const dt = new Date(endTime);
    return dt.getTime() < Date.now();
  }

  function openAndMaybePrint(ev: FinancesEvent, doPrint = false) {
    setSelected(ev);
    setAutoPrint(doPrint);
  }

  async function exportPdf(ev: FinancesEvent) {
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      const marginLeft = 15;
      let y = 15;

      pdf.setFontSize(14);
      pdf.setTextColor(125, 43, 114);
      pdf.text("Event Feedback", marginLeft, y);

      y += 8;
      pdf.setFontSize(18);
      pdf.setTextColor(0, 0, 0);
      pdf.text(String(ev.title || ""), marginLeft, y);

      y += 8;
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`${ev.start_time || ""} ${ev.end_time ? `- ${ev.end_time}` : ""}`, marginLeft, y);

      y += 8;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(marginLeft, y, 195 - marginLeft, y);

      y += 8;

      // If image present, attempt to fetch and add to PDF at left
      if (ev.image) {
        try {
          const imgUrl = `https://cairnsgames.co.za/files/${ev.image}`;
          const resp = await fetch(imgUrl);
          if (resp.ok) {
            const blob = await resp.blob();
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(String(reader.result));
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            // create Image to measure
            await new Promise<void>((res) => {
              const img = new Image();
              img.onload = () => {
                const maxW = 40; // mm
                const imgWpx = img.width;
                const imgHpx = img.height;
                const ratio = imgHpx / imgWpx;
                const imgWmm = maxW;
                const imgHmm = imgWmm * ratio;
                pdf.addImage(dataUrl, "JPEG", marginLeft, y, imgWmm, imgHmm);
                res();
              };
              img.onerror = () => res();
              img.src = dataUrl;
            });
          }
        } catch (e) {
          // ignore image errors
        }
      }

      // Stats block
      const statX = ev.image ? marginLeft + 50 : marginLeft;
      let statY = y;
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);

      pdf.text(`Days displayed: ${ev.days_displayed ?? "-"}`, statX, statY);
      statY += 7;
      pdf.text(`Total views: ${ev.detail_total_views ?? ev.card_total_views ?? 0}`, statX, statY);
      statY += 7;
      pdf.text(`Tickets bought: ${ev.tickets_sold ?? 0}`, statX, statY);
      statY += 7;
      pdf.text(`Ticket price: R ${ev.price ?? 0}`, statX, statY);
      statY += 7;
      pdf.setFontSize(12);
      pdf.text(`Total revenue: R ${ev.total_price ?? 0}`, statX, statY);

      const filename = `${(ev.title || "report").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 120)}.pdf`;
      pdf.save(filename);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("PDF export failed", err);
      // eslint-disable-next-line no-alert
      alert('PDF export failed.');
    }
  }

  function closeModal() {
    setSelected(null);
    setAutoPrint(false);
  }

  const listItems = useMemo(() => events || [], [events]) as FinancesEvent[];

  return (
    <div>
      <h4>Reports</h4>
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
                      onClick={async () => {
                        const summary = await ctx?.getEventSummary?.(ev.id);
                        generateEventPdf(ev, summary ?? undefined);
                      }}
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
