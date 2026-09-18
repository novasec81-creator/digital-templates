import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface DownloadLinkItem {
  title: string;
  url: string;
  remaining: number;
  expiresAt: Date;
}

export function DownloadLinkEmail({
  customerName,
  items,
  accountUrl,
  supportEmail,
}: {
  customerName?: string;
  items: DownloadLinkItem[];
  accountUrl: string;
  supportEmail: string;
}) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Vos fichiers sont prêts à être téléchargés</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif", padding: "24px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px" }}>
          <Heading style={{ fontSize: "22px", marginTop: 0 }}>
            Merci pour votre achat ! 🎉
          </Heading>
          <Text>
            Bonjour{customerName ? ` ${customerName}` : ""}, votre commande a bien été
            confirmée. Vous pouvez télécharger vos fichiers ci-dessous.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            {items.map((item, i) => (
              <div
                key={item.url + i}
                style={{
                  border: "1px solid #f3f4f6",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
                  backgroundColor: "#fafafa",
                }}
              >
                <Text style={{ fontWeight: "600", margin: "0 0 8px" }}>{item.title}</Text>
                <Button
                  href={item.url}
                  style={{
                    backgroundColor: "#111827",
                    color: "#ffffff",
                    borderRadius: "8px",
                    padding: "12px 20px",
                    textDecoration: "none",
                    display: "inline-block",
                    fontWeight: "600",
                  }}
                >
                  Télécharger
                </Button>
                <Text style={{ fontSize: "12px", color: "#6b7280", margin: "12px 0 0" }}>
                  Lien valable jusqu&apos;au{" "}
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(
                    item.expiresAt
                  )}{" "}
                  · {item.remaining} téléchargements restants
                </Text>
              </div>
            ))}
          </Section>
          <Hr />
          <Text>
            Ces liens expirent pour des raisons de sécurité. Votre facture est jointe à
            cet email.
          </Text>
          <Text style={{ margin: "16px 0" }}>
            Une fois connecté à votre compte, vous pouvez retélécharger vos achats sans
            limite de temps :
          </Text>
          <Button
            href={accountUrl}
            style={{
              border: "1px solid #111827",
              color: "#111827",
              borderRadius: "8px",
              padding: "12px 20px",
              textDecoration: "none",
              display: "inline-block",
              fontWeight: "600",
            }}
          >
            Accéder à mes achats
          </Button>
          <Text style={{ fontSize: "12px", color: "#6b7280", marginTop: "24px" }}>
            Une question ? Écrivez-nous à{" "}
            <a href={`mailto:${supportEmail}`} style={{ color: "#4f46e5" }}>
              {supportEmail}
            </a>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default DownloadLinkEmail;