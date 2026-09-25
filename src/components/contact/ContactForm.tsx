"use client";

import { useState } from "react";
import { contactSchema } from "@/lib/validations";
import { STORE_NAME } from "@/lib/constants";

export function ContactForm({ email }: { email: string }) {
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
      setError("Merci de remplir correctement tous les champs obligatoires.");
      setStatus("error");
      return;
    }

    const subject = `[${STORE_NAME}] ${parsed.data.subject || "Demande de contact"}`;
    const body = [
      `Nom : ${parsed.data.name}`,
      `Email de réponse : ${parsed.data.email}`,
      "",
      parsed.data.message,
    ].join("\n");

    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-line bg-paper-2 px-5 py-4 text-sm text-ink-2">
        Votre messagerie s&apos;est ouverte avec le message pré-rempli. Il ne
        vous reste qu&apos;à l&apos;envoyer. Merci !
      </div>
    );
  }

  const fields = [
    { key: "name" as const, label: "Nom", type: "text", required: true },
    { key: "email" as const, label: "Votre email", type: "email", required: true },
    { key: "subject" as const, label: "Sujet", type: "text", required: false },
  ];

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-3 transition-colors focus:border-line-strong";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="block text-sm font-medium text-ink-2">
              {f.label} {f.required && <span className="text-clay">*</span>}
            </label>
            <input
              id={f.key}
              type={f.type}
              required={f.required}
              value={state[f.key]}
              onChange={(e) => update(f.key, e.target.value)}
              className={inputClass}
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink-2">
          Message <span className="text-clay">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={state.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Le template qui vous intéresse, votre projet, vos questions…"
          className={`${inputClass} resize-none`}
        />
      </div>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        className="rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-black"
      >
        Envoyer le message
      </button>
    </form>
  );
}