import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/components/providers/CartProvider";
import { CookieConsentBanner } from "@/components/providers/CookieConsent";
import { TrackingSetup } from "@/components/providers/TrackingSetup";
import { STORE_NAME, STORE_SLOGAN } from "@/lib/constants";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: STORE_NAME,
    template: `%s · ${STORE_NAME}`,
  },
  description: STORE_SLOGAN,
  openGraph: {
    siteName: STORE_NAME,
    type: "website",
    locale: "fr_FR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${geist.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsentBanner />
          <TrackingSetup />
        </CartProvider>
      </body>
    </html>
  );
}