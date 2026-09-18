"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("to") ?? "/mes-achats";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, redirectTo }),
    });
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !data?.ok) {
      setError(data?.error ?? "Une erreur est survenue.");
      setStatus("error");
      return;
    }
    setStatus("sent");
    setTimeout(() => router.replace("/connexion"), 0);
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center text-sm text-green-800">
        Un email de connexion vient d&apos;être envoyé à <strong>{email}</strong>.
        <br />
        Ouvrez-le et cliquez sur le lien pour vous connecter (valable 15 minutes).
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">
          Votre email
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.fr"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Recevoir mon lien de connexion"}
      </button>
      <p className="text-xs text-gray-500">
        Pas de mot de passe à retenir : votre compte est créé automatiquement à votre
        première connexion.
      </p>
    </form>
  );
}