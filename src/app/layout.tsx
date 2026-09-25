import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsentBanner } from "@/components/providers/CookieConsent";
import { TrackingSetup } from "@/components/providers/TrackingSetup";
import {
  ANALYTICS_CONFIGURED,
  requireSiteUrl,
  STORE_DESCRIPTION,
  STORE_NAME,
} from "@/lib/constants";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(requireSiteUrl("layout")),
  title: {
    default: STORE_NAME,
    template: `%s · ${STORE_NAME}`,
  },
  description: STORE_DESCRIPTION,
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
    <html lang="fr" className={`${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Aller au contenu
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {ANALYTICS_CONFIGURED && (
          <>
            <CookieConsentBanner />
            <TrackingSetup />
          </>
        )}
      </body>
    </html>
  );
}