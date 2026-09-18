"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "cookie_consent";

type ConsentValue = "accepted" | "refused";

export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!m) return null;
  const v = m[1];
  return v === "accepted" || v === "refused" ? v : null;
}

/**
 * EU-compliant cookie banner : the refusal option is as easy as acceptance.
 * Third-party scripts stay blocked until the visitor accepts. Strictly
 * necessary cookies (cart, session, affiliate) are exempt from consent.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!getConsent()) setVisible(true);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  function decide(value: ConsentValue) {
    document.cookie = `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setVisible(false);
    window.dispatchEvent(new CustomEvent("cookie-consent", { detail: value }));
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "consent_update",
        consentDenied: value === "refused",
      });
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700">
          Nous utilisons des cookies pour mesurer l&apos;audience et améliorer votre
          expérience. Vous pouvez accepter ou refuser. Voir notre{" "}
          <a className="underline" href="/confidentialite">
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("refused")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}