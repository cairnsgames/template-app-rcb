import { FinancesEvent, EventSummary } from "./finances.types";

export default async function generateEventPdf(ev: FinancesEvent, summary?: EventSummary): Promise<void> {
  try {
    const { jsPDF } = await import("jspdf");
    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 18;
    const centerX = pageWidth / 2;

    // Header
    let y = 22;
    pdf.setFontSize(34);
    pdf.setTextColor(125, 43, 114);
    pdf.setFont("helvetica", "normal");
    pdf.text("Event Feedback", centerX, y, { align: "center" });

    // date on right
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    if (ev.start_time) {
      const dateStr = ev.start_time.split(" ")[0];
      pdf.text(String(dateStr), pageWidth - margin, 30, { align: "right" });
    }

    // event image on right top
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
          const imgW = 36; // mm
          // place at top-right
          pdf.addImage(dataUrl, "JPEG", pageWidth - margin - imgW, 12, imgW, imgW);
        }
      } catch (e) {
        // ignore image errors
      }
    }

    // Title block
    y += 24;
    pdf.setFontSize(20);
    pdf.setTextColor(125, 43, 114);
    pdf.text(String(ev.title || ""), centerX, y, { align: "center" });

    // divider
    y += 8;
    pdf.setDrawColor(80, 80, 80);
    pdf.setLineWidth(0.8);
    pdf.line(margin, y, pageWidth - margin, y);

    // Stats area
    y += 14;
    const labelX = margin + 4;
    const valueX = pageWidth - margin - 4;

    function addStat(label: string, value: string | number) {
      pdf.setFontSize(12);
      pdf.setTextColor(70, 70, 70);
      pdf.text(label, labelX, y);
      pdf.setFontSize(14);
      pdf.setTextColor(125, 43, 114);
      pdf.text(String(value), valueX, y, { align: "right" });
      y += 10;
    }

    addStat("Days displayed", ev.days_displayed ?? "-");
    addStat("Total views", ev.detail_total_views ?? ev.card_total_views ?? 0);
    addStat("Conversion Rate", ev.conversion_rate ?? "-");
    addStat("Tickets bought", ev.tickets_sold ?? 0);
    addStat("Ticket price", `R ${ev.price ?? 0}`);
    addStat("Total revenue", `R ${ev.total_price ?? 0}`);

    // If we have a summary object, add the requested breakdown
    if (summary) {
      y += 4;
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text("", labelX, y); // spacer
      y += 6;
      addStat("Tickets Sold", summary.total_price ?? ev.total_price ?? 0);
      addStat("Platform fee", `R ${summary.platform_gross_total ?? summary.platform_gross_total ?? "0"}`);
      addStat("Platform VAT", `R ${summary.platform_tax_total ?? "0"}`);
      if (summary.other_vat && Number(summary.other_vat) !== 0) {
        addStat("Other VAT payable", `R ${summary.other_vat}`);
      }
      addStat("Amount to you", `R ${summary.user_gross_total ?? summary.user_gross_total ?? "0"}`);
      addStat("Amount to you VAT", `R ${summary.user_tax_total ?? "0"}`);
    } else {
      // Fallback: use fields present on event
      if (typeof ev.platform_fee !== "undefined") {
        addStat("Platform fee", `R ${ev.platform_fee}`);
      }
    }

    const filename = `${(ev.title || "report").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 120)}.pdf`;
    pdf.save(filename);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("generateEventPdf failed", err);
    throw err;
  }
}
