import { FinancesEvent, EventSummary, TicketType, TicketOption } from "./finances.types";

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
    if (ev.price && Number(ev.price) !== 0) {
      addStat("Ticket price", `R ${Number(ev.price).toFixed(2)}`);
    }
    addStat("Total revenue", `R ${Number(ev.total_price ?? 0).toFixed(2)}`);

    // Helper to draw a simple table
    function drawTable(
      headers: string[],
      rows: (string | number)[][],
      colWidths: number[],
      startX: number
    ) {
      const rowHeight = 8;
      const headerHeight = 7;

      // Header row background
      pdf.setFillColor(240, 235, 245);
      pdf.rect(startX, y - 5, colWidths.reduce((a, b) => a + b, 0), headerHeight, "F");

      pdf.setFontSize(10);
      pdf.setTextColor(80, 80, 80);
      pdf.setFont("helvetica", "bold");
      let cx = startX;
      headers.forEach((h, i) => {
        const align = i === 0 ? "left" : "right";
        const tx = align === "right" ? cx + colWidths[i] - 2 : cx + 2;
        pdf.text(h, tx, y, { align });
        cx += colWidths[i];
      });
      y += headerHeight;

      pdf.setFont("helvetica", "normal");
      rows.forEach((row, ri) => {
        if (ri % 2 === 1) {
          pdf.setFillColor(250, 250, 250);
          pdf.rect(startX, y - 5, colWidths.reduce((a, b) => a + b, 0), rowHeight, "F");
        }
        pdf.setFontSize(10);
        pdf.setTextColor(50, 50, 50);
        cx = startX;
        row.forEach((cell, i) => {
          const align = i === 0 ? "left" : "right";
          const tx = align === "right" ? cx + colWidths[i] - 2 : cx + 2;
          pdf.text(String(cell), tx, y, { align });
          cx += colWidths[i];
        });
        y += rowHeight;
      });

      // bottom border
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.3);
      pdf.line(startX, y - 1, startX + colWidths.reduce((a, b) => a + b, 0), y - 1);
      y += 4;
    }

    const tableWidth = pageWidth - margin * 2;
    const colWidths = [tableWidth * 0.45, tableWidth * 0.2, tableWidth * 0.15, tableWidth * 0.2];

    // Ticket Types section
    if (ev.ticket_types && ev.ticket_types.length > 0) {
      y += 4;
      pdf.setFontSize(13);
      pdf.setTextColor(125, 43, 114);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ticket Types", labelX, y);
      y += 7;

      const ttRows = ev.ticket_types.map((tt: TicketType) => [
        tt.name,
        `R ${Number(tt.price).toFixed(2)}`,
        String(tt.tickets_sold ?? 0),
        `R ${Number(tt.total_value ?? 0).toFixed(2)}`,
      ]);
      drawTable(["Name", "Price", "Sold", "Total"], ttRows, colWidths, margin);
    }

    // Ticket Options section
    if (ev.ticket_options && ev.ticket_options.length > 0) {
      y += 4;
      pdf.setFontSize(13);
      pdf.setTextColor(125, 43, 114);
      pdf.setFont("helvetica", "bold");
      pdf.text("Ticket Options", labelX, y);
      y += 7;

      const toRows = ev.ticket_options.map((to: TicketOption) => [
        to.name,
        `R ${Number(to.price).toFixed(2)}`,
        String(to.tickets_sold ?? 0),
        `R ${Number(to.total_value ?? 0).toFixed(2)}`,
      ]);
      drawTable(["Name", "Price", "Sold", "Total"], toRows, colWidths, margin);
    }

    // If we have a summary object, add the requested breakdown
    if (summary) {
      y += 4;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(125, 43, 114);
      pdf.text("Payment Summary", labelX, y);
      y += 7;
      addStat("Tickets revenue", `R ${Number(summary.total_price ?? ev.total_price ?? 0).toFixed(2)}`);
      addStat("Platform fee (incl VAT)", `R ${Number(summary.platform_gross_total ?? 0).toFixed(2)}`);
      addStat("Platform VAT", `R ${Number(summary.platform_tax_total ?? 0).toFixed(2)}`);
      if (summary.other_vat && Number(summary.other_vat) !== 0) {
        addStat("Other VAT payable", `R ${Number(summary.other_vat).toFixed(2)}`);
      }
      addStat("Amount to you (incl VAT)", `R ${Number(summary.user_gross_total ?? 0).toFixed(2)}`);
      addStat("Your VAT", `R ${Number(summary.user_tax_total ?? 0).toFixed(2)}`);
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
