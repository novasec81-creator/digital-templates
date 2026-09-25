import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  eyebrow,
  title,
  description,
  linkHref,
  linkLabel,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  linkHref?: string;
  linkLabel?: string;
  center?: boolean;
}) {
  const heading = (
    <>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl ${
          center ? "text-balance" : ""
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 leading-relaxed text-ink-2">{description}</p>
      )}
    </>
  );

  return (
    <div
      className={`flex flex-col gap-4 ${
        center ? "items-center text-center" : "items-start sm:flex-row sm:items-end sm:justify-between"
      }`}
    >
      <div className={`max-w-2xl ${center ? "mx-auto" : ""}`}>{heading}</div>
      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-ink transition-colors hover:text-clay"
        >
          {linkLabel}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}