"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { trackClient } from "@/lib/analytics";

export function AccountDownloadButton({
  orderItemId,
  title,
}: {
  orderItemId: string;
  title: string;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function download() {
    setStatus("loading");
    try {
      const res = await fetch(`/api/compte/telechargement/${orderItemId}`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!res.ok || !data?.url) {
        setStatus("error");
        return;
      }
      trackClient("download_started", { product: title });
      window.location.href = data.url;
    } catch {
      setStatus("error");
    }
  }

  if (status === "error") {
    return <span className="text-xs text-red-600">Erreur, réessayez.</span>;
  }

  return (
    <button
      type="button"
      onClick={download}
      disabled={status === "loading"}
      className="inline-flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
    >
      <Download className="h-3.5 w-3.5" />
      {status === "loading" ? "Préparation…" : "Télécharger"}
    </button>
  );
}