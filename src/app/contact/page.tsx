import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { STORE_LEGAL } from "@/lib/constants";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <h1 className="text-3xl font-bold tracking-tight">Contact</h1>
      <p className="mt-2 text-gray-600">
        Une question sur nos templates ? Réponse sous 24 h ouvrées.
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 p-6">
        <ContactForm />
      </div>
      <p className="mt-4 text-sm text-gray-500">
        Ou directement :{" "}
        <a href={`mailto:${STORE_LEGAL.email}`} className="text-blue-600 underline">
          {STORE_LEGAL.email}
        </a>
      </p>
    </div>
  );
}