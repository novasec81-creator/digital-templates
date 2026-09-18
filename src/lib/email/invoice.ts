import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface InvoiceLine {
  title: string;
  quantity: number;
  priceCents: number;
}

/**
 * Generates a simple A4 PDF invoice without native dependencies (pure JS via
 * pdf-lib). Returns the PDF as a Buffer ready to attach to an email.
 */
export async function generateInvoicePdf(params: {
  invoiceNumber: string;
  storeName: string;
  storeLegal: string;
  buyerEmail: string;
  buyerName?: string;
  lines: InvoiceLine[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  currency?: string;
  taxAmountCents?: number;
}): Promise<Buffer> {
  const {
    invoiceNumber,
    storeName,
    storeLegal,
    buyerEmail,
    buyerName,
    lines,
    subtotalCents,
    discountCents,
    totalCents,
    currency = "EUR",
    taxAmountCents = 0,
  } = params;

  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595.28, 841.89]); // A4
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const fmt = (c: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(c / 100);
  const black = rgb(0.1, 0.1, 0.12);
  const gray = rgb(0.45, 0.45, 0.45);
  const light = rgb(0.9, 0.9, 0.92);
  const margin = 48;
  let y = 760;

  page.drawText(storeName, { x: margin, y, size: 22, font: fontBold, color: black });
  let wrappedStore = storeLegal;
  const legalLines: string[] = [];
  if (wrappedStore.length > 70) {
    const first = wrappedStore.slice(0, 70);
    wrappedStore = wrappedStore.slice(70);
    legalLines.push(first);
  }
  legalLines.push(wrappedStore);
  y -= 16;
  for (const ln of legalLines) {
    page.drawText(ln, { x: margin, y, size: 8.5, font, color: gray });
    y -= 12;
  }

  const rightX = 547;
  page.drawText(`INVOICE / FACTURE`, { x: rightX - 150, y: 780, size: 16, font: fontBold, color: black });
  page.drawText(`N° ${invoiceNumber}`, { x: rightX - 150, y: 762, size: 10, font, color: gray });
  page.drawText(
    `Date : ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date())}`,
    { x: rightX - 150, y: 748, size: 10, font, color: gray }
  );

  y -= 30;
  page.drawText("Facturé à", { x: margin, y, size: 9, font: fontBold, color: gray });
  y -= 14;
  if (buyerName) {
    page.drawText(buyerName, { x: margin, y, size: 11, font, color: black });
    y -= 14;
  }
  page.drawText(buyerEmail, { x: margin, y, size: 11, font, color: black });

  y -= 40;
  // Table header
  const colTitle = margin;
  const colQty = 430;
  const colPrice = 505;
  page.drawRectangle({
    x: margin,
    y: y - 6,
    width: 500,
    height: 22,
    color: light,
  });
  page.drawText("Produit", { x: colTitle, y: y + 6, size: 10, font: fontBold, color: black });
  page.drawText("Qté", { x: colQty, y: y + 6, size: 10, font: fontBold, color: black });
  page.drawText("Prix", { x: colPrice, y: y + 6, size: 10, font: fontBold, color: black });
  y -= 30;

  for (const line of lines) {
    page.drawText(
      line.title.length > 48 ? `${line.title.slice(0, 46)}…` : line.title,
      { x: colTitle, y, size: 10, font, color: black }
    );
    page.drawText(String(line.quantity), { x: colQty, y, size: 10, font, color: black });
    page.drawText(fmt(line.priceCents * line.quantity), {
      x: colPrice - 70,
      y,
      size: 10,
      font,
      color: black,
    });
    y -= 26;
  }

  y -= 12;
  const totals = [
    { label: "Sous-total", value: fmt(subtotalCents) },
    ...(discountCents > 0 ? [{ label: "Réduction", value: `-${fmt(discountCents)}` }] : []),
    ...(taxAmountCents > 0 ? [{ label: "Taxe (TVA)", value: fmt(taxAmountCents) }] : []),
    { label: "Total TTC", value: fmt(totalCents), bold: true as const },
  ];
  for (const t of totals) {
    page.drawText(t.label, { x: 380, y, size: 10, font: t.bold ? fontBold : font, color: black });
    page.drawText(t.value, { x: 505, y, size: 10, font: t.bold ? fontBold : font, color: black });
    y -= 18;
  }

  y -= 24;
  page.drawText(
    "Livraison immédiate de fichiers numériques — renonciation au droit de rétractation (art. L221-28 du Code de la consommation) acceptée."
      .slice(0, 110),
    { x: margin, y, size: 8, font, color: gray }
  );

  const bytes = await pdf.save();
  return Buffer.from(bytes);
}