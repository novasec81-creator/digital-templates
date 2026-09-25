import Link from "next/link";
import { STORE_NAME } from "@/lib/constants";

/**
 * Logo typographique « Format » : un motif en 4 blocs (l'idée de gabarit /
 * de format) suivi du nom de marque.
 */
export function BrandMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9 9h6v6H9zM17 9h6v6h-6zM9 17h6v6H9z"
        fill="var(--color-paper)"
        fillOpacity="0.92"
      />
      <path
        d="M17 17h6v6h-6z"
        fill="var(--color-clay-soft)"
        fillOpacity="0.9"
      />
    </svg>
  );
}

export function Brand({
  className = "",
  wordmarkClassName = "text-[17px]",
}: {
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 rounded-lg text-ink ${className}`}
      aria-label={`${STORE_NAME} — page d'accueil`}
    >
      <BrandMark className="h-7 w-7 transition-transform duration-200 group-hover:scale-105" />
      <span className={`font-extrabold tracking-tight ${wordmarkClassName}`}>
        {STORE_NAME}
      </span>
    </Link>
  );
}