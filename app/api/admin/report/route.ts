import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getDashboardSnapshot } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const snapshot = await getDashboardSnapshot({ dateFrom, dateTo });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = 790;
  page.drawText("Rapport Decotable", {
    x: 40,
    y,
    size: 22,
    font: bold,
    color: rgb(0, 0, 0),
  });

  y -= 28;
  page.drawText(`Periode: ${dateFrom || "debut"} au ${dateTo || "aujourd'hui"}`, {
    x: 40,
    y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  y -= 40;
  const lines = [
    `Revenu: ${formatMAD(snapshot.revenue)}`,
    `Commandes: ${snapshot.monthlyOrders}`,
    `Visites: ${snapshot.visits}`,
    `Clients: ${snapshot.customers}`,
    `Stock: ${snapshot.stock}`,
    `Panier moyen: ${formatMAD(snapshot.averageBasket)}`,
    `Conversion: ${snapshot.conversionRate}%`,
    `Top produit: ${snapshot.topProduct}`,
  ];

  for (const line of lines) {
    page.drawText(line, { x: 40, y, size: 12, font });
    y -= 20;
  }

  y -= 12;
  page.drawText("Commandes", {
    x: 40,
    y,
    size: 16,
    font: bold,
  });

  y -= 24;
  for (const order of snapshot.orders.slice(0, 20)) {
    const row = `${order.id} | ${order.user_email} | ${order.city} | ${order.status} | ${formatMAD(order.total)}`;
    page.drawText(row.slice(0, 95), { x: 40, y, size: 10, font });
    y -= 16;
    if (y < 60) break;
  }

  const bytes = await pdf.save();
  const body = Buffer.from(bytes);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="decotable-report-${dateFrom || "all"}-${dateTo || "today"}.pdf"`,
    },
  });
}
