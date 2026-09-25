"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PLAN_HREF, PRIMARY_NAV } from "@/lib/site";
import { track } from "@/lib/analytics";
import { Arrow, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brand" aria-label="Prestagio home">
          Prestagio
        </Link>
        <nav className="nav" aria-label="Primary">
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-actions">
          <Link href="/search" className="icon-link" aria-label="Search stories">
            <SearchIcon />
          </Link>
          <Link href="/plan#saved" className="icon-link icon-link--saved" aria-label="Saved escapes">
            <HeartIcon />
          </Link>
          <Link href={PLAN_HREF} className="btn btn--sm" onClick={() => track("plan_cta_click", { from: "header" })}>
            Plan an Escape <Arrow />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <CloseIcon /> : <MenuIcon />}
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="mobile-panel" data-open={open}>
        <nav aria-label="Primary mobile">
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/search">Search</Link>
            </li>
            <li>
              <Link href="/plan#saved">Saved escapes</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
