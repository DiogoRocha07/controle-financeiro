"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export type HeaderItem = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "link" | "button";
  tone?: "primary" | "secondary";
};

type HeaderProps = {
  brand: React.ReactNode;
  items?: HeaderItem[];
  className?: string;
};

export default function Header({ brand, items = [], className }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasItems = items.length > 0;

  const mobilePanelId = useMemo(() => "header-mobile-panel", []);

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <header
      className={["w-full bg-white shadow-sm", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <div className="shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900 hover:text-black"
            onClick={closeMobile}
          >
            {brand}
          </Link>
        </div>

        {hasItems ? (
          <>
            <nav className="hidden flex-wrap items-center justify-end gap-2 sm:flex">
              {items.map((item) => {
                const isPrimary =
                  item.tone === "primary" ||
                  (!item.tone && item.label === "Criar conta");

                if (item.variant === "button") {
                  const buttonClasses = [
                    "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300",
                    isPrimary
                      ? "bg-slate-900 text-white shadow-sm hover:bg-black focus-visible:ring-slate-400"
                      : "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50",
                  ].join(" ");

                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={item.onClick}
                        className={buttonClasses}
                      >
                        {item.label}
                      </button>
                    );
                  }

                  if (item.href) {
                    return (
                      <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        className={buttonClasses}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return null;
                }

                if (!item.href) return null;

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-900 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 sm:hidden"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileOpen}
              aria-controls={mobilePanelId}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="text-lg leading-none">
                {mobileOpen ? "✕" : "☰"}
              </span>
            </button>
          </>
        ) : null}
      </div>

      {hasItems ? (
        <div
          id={mobilePanelId}
          className={[
            "sm:hidden",
            mobileOpen ? "block" : "hidden",
            "border-t border-slate-200 bg-white",
          ].join(" ")}
        >
          <nav className="mx-auto w-full max-w-6xl px-6 py-4">
            <div className="flex flex-col gap-2.5">
              {items.map((item) => {
                const base =
                  "w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";

                const isPrimary =
                  item.tone === "primary" ||
                  (!item.tone && item.label === "Criar conta");

                if (item.variant === "button") {
                  const buttonClasses = [
                    base,
                    "inline-flex h-11 items-center justify-center",
                    isPrimary
                      ? "bg-slate-900 text-white shadow-sm hover:bg-black focus-visible:ring-slate-400"
                      : "border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-50",
                  ].join(" ");

                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          item.onClick?.();
                          closeMobile();
                        }}
                        className={buttonClasses}
                      >
                        {item.label}
                      </button>
                    );
                  }

                  if (item.href) {
                    return (
                      <Link
                        key={`${item.href}-${item.label}`}
                        href={item.href}
                        onClick={closeMobile}
                        className={buttonClasses}
                      >
                        {item.label}
                      </Link>
                    );
                  }

                  return null;
                }

                if (!item.href) return null;

                return (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    onClick={closeMobile}
                    className={[
                      base,
                      "text-slate-600 hover:bg-slate-100 hover:text-black",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
