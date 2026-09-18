import type { ReactElement } from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { render } from "@react-email/components";
import { Resend } from "resend";
import { prisma } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/email/invoice";
import { DownloadLinkEmail, type DownloadLinkItem } from "@/emails/DownloadLinkEmail";

const FROM = () => process.env.EMAIL_FROM ?? "Store <no-reply@localhost>";
const SUPPORT = () => process.env.EMAIL_REPLY_TO ?? "support@localhost";
const APP_URL = () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const LEGAL_NAME = () => process.env.STORE_LEGAL_NAME ?? "Votre Entreprise (SIRET à renseigner)";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function renderEmail(component: ReactElement): Promise<{ html: string; text: string }> {
  const html = await render(component);
  const text = await render(component, { plainText: true });
  return { html, text };
}

async function sendRaw(params: {
  to: string;
  subject: string;
  react: ReactElement;
  attachments?: { filename: string; content: Buffer }[];
}) {
  const resend = getResend();
  if (!resend) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[email] RESEND_API_KEY missing — email not sent:", params.subject, params.to);
    }
    return null;
  }
  const { html, text } = await renderEmail(params.react);
  return resend.emails.send({
    from: FROM(),
    to: params.to,
    replyTo: SUPPORT(),
    subject: params.subject,
    html,
    text,
    ...(params.attachments
      ? {
          attachments: params.attachments.map((a) => ({
            filename: a.filename,
            content: a.content, // Buffer is accepted by the Resend SDK
          })),
        }
      : {}),
  });
}

function WelcomeEmail({ magicUrl, supportEmail }: { magicUrl: string; supportEmail: string }) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Connexion à votre compte</Preview>
      <Body style={{ backgroundColor: "#ffffff", fontFamily: "sans-serif", padding: "24px" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px" }}>
          <Heading style={{ fontSize: "20px", marginTop: 0 }}>Connexion</Heading>
          <Text>
            Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien expirera dans 15 minutes.
          </Text>
          <Button
            href={magicUrl}
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
            Me connecter
          </Button>
          <Text style={{ fontSize: "12px", color: "#6b7280", marginTop: "24px" }}>
            Ou copiez ce lien : {magicUrl}
            <br />
            Si vous n&apos;êtes pas à l&apos;origine de cette demande, ignorez cet email.
            Contact : <a href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Sent after a successful Stripe webhook. Contains the secure download links
 * (72h / 5 downloads) and the invoice PDF attached.
 */
export async function sendPurchaseConfirmation(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true, tokens: true } } },
  });
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.items.length === 0) return;

  const items: DownloadLinkItem[] = order.items.map((item) => {
    const token = item.tokens[0];
    return {
      title: item.product.title,
      url: token ? `${APP_URL()}/api/telechargement/${token.token}` : APP_URL(),
      remaining: token ? token.maxDownloads - token.downloadCount : 0,
      expiresAt: token?.expiresAt ?? new Date(),
    };
  });

  const invoiceNumber = `F-${order.id.slice(0, 8).toUpperCase()}`;
  const subtotal = order.items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);
  const discount = order.discountCents;
  const total = order.totalCents;
  const pdf = await generateInvoicePdf({
invoiceNumber,
    storeName: "Templates Store",
    storeLegal: LEGAL_NAME(),
    buyerEmail: order.email,
    lines: order.items.map((it) => ({
      title: it.product.title,
      quantity: it.quantity,
      priceCents: it.priceCents,
    })),
    subtotalCents: subtotal,
    discountCents: discount,
    totalCents: total,
  });

  const pdfFilename = `facture-${invoiceNumber.toLowerCase()}.pdf`;

  await sendRaw({
    to: order.email,
    subject: "Votre commande est prête — téléchargement + facture",
    react: DownloadLinkEmail({
      items,
      accountUrl: `${APP_URL()}/mes-achats`,
      supportEmail: SUPPORT(),
    }),
    attachments: [{ filename: pdfFilename, content: pdf }],
  });
}

/** Sent when a magic login link is requested. */
export async function sendLoginLink(email: string, magicUrl: string) {
  return sendRaw({
    to: email,
    subject: "Votre lien de connexion",
    react: <WelcomeEmail magicUrl={magicUrl} supportEmail={SUPPORT()} />,
  });
}