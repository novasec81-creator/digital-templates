import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export interface InvoiceLine {
  title: string;
  quantity: number;
  priceCents: number;
}

export function InvoiceEmail({
  invoiceNumber,
  buyerEmail,
  lines,
  subtotalCents,
  discountCents,
  totalCents,
  legalName,
}: {
  invoiceNumber: string;
  buyerEmail: string;
  lines: InvoiceLine[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  legalName: string;
}) {
  const fmt = (c: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(c / 100);

  return (
    <Html lang="fr">
      <Head />
      <Preview>Facture {invoiceNumber}</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif", padding: "24px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px" }}>
          <Heading style={{ fontSize: "20px", marginTop: 0 }}>Facture {invoiceNumber}</Heading>
          <Text style={{ color: "#6b7280", fontSize: "14px" }}>
            {legalName} · Acheteur : {buyerEmail}
          </Text>
          <Section
            style={{
              borderTop: "1px solid #f3f4f6",
              borderBottom: "1px solid #f3f4f6",
              padding: "8px 0",
              fontSize: "14px",
            }}
          >
            {lines.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                }}
              >
                <span>
                  {l.title} × {l.quantity}
                </span>
                <span>{fmt(l.priceCents * l.quantity)}</span>
              </div>
            ))}
          </Section>
          <Section style={{ fontSize: "14px", marginTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
              <span>Sous-total</span>
              <span>{fmt(subtotalCents)}</span>
            </div>
            {discountCents > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                <span>Réduction</span>
                <span>-{fmt(discountCents)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: "700" }}>
              <span>Total TTC</span>
              <span>{fmt(totalCents)}</span>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default InvoiceEmail;