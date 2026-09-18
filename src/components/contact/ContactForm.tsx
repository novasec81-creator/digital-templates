"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validations";

export function ContactForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof state>(key: K, value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    const parsed = contactSchema.safeParse(state);
    if (!parsed.success) {
      setError("Merci de remplir tous les champs correctement.");
      setStatus("error");
      return;
    }

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
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
        Merci ! Votre message a bien été envoyé.
      </div>
    );
  }

  const fields = [
    { key: "name" as const, label: "Nom", type: "text", required: true },
    { key: "email" as const, label: "Email", type: "email", required: true },
    { key: "subject" as const, label: "Sujet", type: "text", required: false },
  ];

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="block text-sm font-medium text-gray-700">
              {f.label}
            </label>
            <input
              id={f.key}
              type={f.type}
              required={f.required}
              value={state[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={state.message}
          onChange={(e) => update("message", e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}