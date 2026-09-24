"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validations";
import { STORE_LEGAL } from "@/lib/constants";

export function ContactForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof state>(key: K, value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsed = contactSchema.safeParse(state);
    if (!parsed.success) {
      setError("Merci de remplir tous les champs correctement.");
      setStatus("error");
      return;
    }

    const subject = `[Templates Store] ${parsed.data.subject || "Contact"}`;
    const body = [
      `Nom : ${parsed.data.name}`,
      `Email : ${parsed.data.email}`,
      "",
      parsed.data.message,
    ].join("\n");

    const mailto = `mailto:${STORE_LEGAL.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        Votre client email s&apos;est ouvert avec votre message pré-rempli. Merci de
        l&apos;envoyer pour nous contacter.
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
        className="rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
      >
        Envoyer
      </button>
    </form>
  );
}