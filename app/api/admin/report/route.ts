import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getDashboardSnapshot } from "@/lib/data/store";
import { formatMAD } from "@/lib/utils";

function formatDate(date?: string) {
  if (!date) return "Aujourd'hui";
  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Casablanca",
  }).format(new Date(date));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const snapshot = await getDashboardSnapshot({ dateFrom, dateTo }, { fallbackToMock: false });

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 0,
    y: 770,
    width: 595,
    height: 72,
    color: rgb(0.97, 0.95, 0.92),
  });

  page.drawText("Decotable", {
    x: 40,
    y: 800,
    size: 28,
    font: bold,
    color: rgb(0.77, 0.64, 0.52),
  });

  page.drawText("Maison, table & cadeaux", {
    x: 42,
    y: 782,
    size: 10,
    font,
    color: rgb(0.25, 0.25, 0.25),
  });

  page.drawText("Rapport d'activite", {
    x: 385,
    y: 800,
    size: 18,
    font: bold,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Edition: ${formatDate(new Date().toISOString())}`, {
    x: 385,
    y: 782,
    size: 10,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  let y = 735;
  page.drawText(`Periode: ${formatDate(dateFrom)} au ${formatDate(dateTo)}`, {
    x: 40,
    y,
    size: 11,
    font,
    color: rgb(0.35, 0.35, 0.35),
  });

  const cards = [
    ["Revenu", formatMAD(snapshot.revenue)],
    ["Commandes", String(snapshot.monthlyOrders)],
    ["Visites", String(snapshot.visits)],
    ["Clients", String(snapshot.customers)],
    ["Stock", String(snapshot.stock)],
    ["Panier moyen", formatMAD(snapshot.averageBasket)],
  ];

  y -= 36;
  cards.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 40 + col * 255;
    const top = y - row * 82;

    page.drawRectangle({
      x,
      y: top,
      width: 220,
      height: 62,
      color: rgb(1, 1, 1),
      borderColor: rgb(0.92, 0.9, 0.86),
      borderWidth: 1,
    });
    page.drawText(label, {
      x: x + 14,
      y: top + 38,
      size: 10,
      font,
      color: rgb(0.45, 0.45, 0.45),
    });
    page.drawText(value, {
      x: x + 14,
      y: top + 16,
      size: 18,
      font: bold,
      color: rgb(0, 0, 0),
    });
  });

  y -= 270;
  page.drawText("Commandes recentes", {
    x: 40,
    y,
    size: 16,
    font: bold,
    color: rgb(0, 0, 0),
  });

  y -= 22;
  for (const order of snapshot.orders.slice(0, 12)) {
    page.drawRectangle({
      x: 40,
      y: y - 8,
      width: 515,
      height: 34,
      color: rgb(0.99, 0.99, 0.99),
      borderColor: rgb(0.92, 0.92, 0.92),
      borderWidth: 1,
    });
    const row = `${order.user_email} | ${order.city} | ${order.status} | ${formatMAD(order.total)}`;
    page.drawText(row.slice(0, 90), {
      x: 52,
      y: y + 5,
      size: 10,
      font,
      color: rgb(0.15, 0.15, 0.15),
    });
    y -= 40;
    if (y < 70) break;
  }

  page.drawText("decotable.ma", {
    x: 40,
    y: 28,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  });

  const bytes = await pdf.save();
  const body = Buffer.from(bytes);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="decotable-report-${dateFrom || "all"}-${dateTo || "today"}.pdf"`,
    },
  });
}
