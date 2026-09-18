"use client";

import { useEffect } from "react";
import { getConsent } from "@/components/providers/CookieConsent";

/**
 * Loads third-party scripts (GTM, GA4, Clarity) ONLY after explicit consent.
 * Without consent the tags are never injected, which is the point of the
 * banner implementation (see README → Analytics).
 */
export function TrackingSetup() {
  useEffect(() => {
    if (getConsent() !== "accepted") return;

    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
    const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
    const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

    // Google Tag Manager (holds GA4, Consent Mode v2, custom events).
    if (gtmId) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
      const g = document.createElement("script");
      g.async = true;
      g.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(g);
    } else if (ga4Id) {
      // Direct GA4 fallback if no GTM container configured.
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({
        "gtm.start": new Date().getTime(),
        event: "gtm.js",
      });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
      document.head.appendChild(s);
      s.onload = () => {
        window.gtag?.("js", new Date());
        window.gtag?.("config", ga4Id);
      };
    }

    // Google Analytics 4 (if not already covered via GTM).
    if (ga4Id && gtmId) {
      window.gtag?.("config", ga4Id);
    }

    // Microsoft Clarity heatmaps + session recordings.
    if (clarityId) {
      window.clarity = window.clarity || function (...args: unknown[]) {
        window.clarity_queue = window.clarity_queue || [];
        window.clarity_queue.push(args);
      };
      const c = document.createElement("script");
      c.async = true;
      c.src = `https://www.clarity.ms/tag/${clarityId}`;
      document.head.appendChild(c);
    }
  }, []);

  return null;
}