"use client";

import { useEffect, useState } from "react";

const CONSENT_COOKIE = "format_consent";

type ConsentValue = "accepted" | "refused";

export function getConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!m) return null;
  const v = m[1];
  return v === "accepted" || v === "refused" ? v : null;
}

/**
 * Bandeau de consentement aux cookies. Il n'est monté que si un outil de
 * mesure d'audience est configuré (ANALYTICS_CONFIGURED) : sans outils,
 * aucun cookie n'est posé et aucune bannière n'est affichée. Le refus est
 * aussi simple que l'acceptation, le choix est conservé 1 an.
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper p-4 shadow-float"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-ink-2">
          Nous utilisons des cookies de mesure d&apos;audience pour améliorer le
          site. Vous pouvez accepter ou refuser. Voir notre{" "}
          <a
            className="font-semibold text-ink underline decoration-clay underline-offset-4 transition-colors hover:text-clay"
            href="/confidentialite"
          >
            politique de confidentialité
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide("refused")}
            className="rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-paper-2"
          >
            Tout refuser
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-black"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}