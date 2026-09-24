import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

const NAV_LINKS = [
  { href: "/produits", label: "Templates" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4"
        aria-label="Navigation principale"
      >
        <Link href="/" className="text-lg font-bold tracking-tight text-gray-900">
          {STORE_NAME}
        </Link>
        <div className="flex flex-wrap items-center justify-end gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}