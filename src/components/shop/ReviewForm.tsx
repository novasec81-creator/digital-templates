"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const RATINGS = [
  { value: 5, label: "Excellent" },
  { value: 4, label: "Très bien" },
  { value: 3, label: "Correct" },
  { value: 2, label: "Décevant" },
  { value: 1, label: "Très décevant" },
];

export function ReviewForm({ productId, isVerified }: { productId: string; isVerified: boolean }) {
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, authorName, content, rating }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Une erreur est survenue.");
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Merci ! Votre avis a été soumis et apparaîtra après modération.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-gray-200 p-5">
      <div>
        <p className="text-sm font-medium text-gray-700">Votre note</p>
        <div className="mt-2 flex gap-1.5">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRating(r.value)}
              title={r.label}
              aria-label={`${r.value} étoiles : ${r.label}`}
              className="p-0.5"
            >
              <Star
                className={`h-6 w-6 ${r.value <= rating ? "text-amber-400" : "text-gray-300"}`}
                fill="currentColor"
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="authorName" className="text-sm font-medium text-gray-700">
          Nom affiché
        </label>
        <input
          id="authorName"
          required
          minLength={2}
          maxLength={60}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>
      <div>
        <label htmlFor="reviewContent" className="text-sm font-medium text-gray-700">
          Votre avis
        </label>
        <textarea
          id="reviewContent"
          required
          minLength={10}
          maxLength={800}
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <p className="mt-1 text-xs text-gray-500">
          {content.length}/800 — Les avis sont modérés avant publication.
          {isVerified && " · Achat vérifié"}
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Publier mon avis"}
      </button>
    </form>
  );
}