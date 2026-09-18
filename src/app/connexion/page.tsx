import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) redirect("/mes-achats");

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
      <p className="mt-2 text-gray-600">
        Connectez-vous pour retélécharger vos achats sans limite de temps.
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 p-6">
        <Suspense fallback={<div className="h-40" aria-hidden="true" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}