import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { AccountDownloadButton } from "@/components/account/AccountDownloadButton";
import { price } from "@/lib/constants";

export const metadata: Metadata = { title: "Mes achats", robots: { index: false } };

export default async function PurchasesPage() {
  const user = await getSessionUser();
  if (!user) redirect("/connexion?to=%2Fmes-achats");

  const orders = await prisma.order.findMany({
    where: { userId: user.id, status: "PAID" },
    orderBy: { createdAt: "desc" },
    include: {
      items: { include: { product: true, tokens: true } },
    },
  });

  const activeTokenCount = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.tokens.length, 0),
    0
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes achats</h1>
          <p className="mt-1 text-sm text-gray-600">{user.email}</p>
        </div>
        <Link
          href="/produits"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Boutique
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-16 rounded-xl border border-dashed border-gray-300 py-20 text-center">
          <p className="text-gray-600">Vous n&apos;avez pas encore d&apos;achat.</p>
          <Link
            href="/produits"
            className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-gray-500">
            {activeTokenCount > 0
              ? "Retéléchargez vos fichiers sans limite de temps depuis cet espace."
              : "Tous vos fichiers sont disponibles ci-dessous."}
          </p>
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
                <span>
                  Commande du{" "}
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(order.createdAt)}
                </span>
                <span className="font-medium text-gray-900">Total : {price(order.totalCents)}</span>
              </div>
              <ul className="mt-4 divide-y divide-gray-100">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.product.title}</p>
                      <p className="text-xs text-gray-500">
                        Licence pour {item.quantity} exemplaire{item.quantity > 1 ? "s" : ""} ·{" "}
                        {price(item.priceCents)}
                      </p>
                    </div>
                    <AccountDownloadButton
                      orderItemId={item.id}
                      title={item.product.title}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}