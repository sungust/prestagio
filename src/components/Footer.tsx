import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">Prestagio</p>
            <p className="footer-note">
              A luxury travel and lifestyle publication. We write about places, stays, cars, watches and aroma, and help you design an escape
              that brings them together.
            </p>
            <p className="footer-note">
              Some links to stays are affiliate links: if you book through them, Prestagio may earn a commission at no extra cost to you. It
              never decides what we recommend. <Link href="/disclosure">Affiliate disclosure</Link>.
            </p>
          </div>
          <nav aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              <li><Link href="/destinations">Destinations</Link></li>
              <li><Link href="/hotels">Stays</Link></li>
              <li><Link href="/cars">Cars</Link></li>
              <li><Link href="/watches">Watches</Link></li>
              <li><Link href="/aroma">Aroma</Link></li>
              <li><Link href="/plan">Plan an Escape</Link></li>
            </ul>
          </nav>
          <nav aria-label="About Prestagio">
            <h2>Prestagio</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/editorial-standards">Editorial standards</Link></li>
              <li><Link href="/contact?topic=correction">Report a correction</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2>Legal</h2>
            <ul>
              <li><Link href="/privacy">Privacy</Link></li>
              <li><Link href="/disclosure">Affiliate disclosure</Link></li>
              <li><Link href="/credits">Image credits</Link></li>
              <li><a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a></li>
            </ul>
          </nav>
        </div>
        <div className="footer-legal">
          <span>© {year} Prestagio. All rights reserved.</span>
          <span>Prestagio is an independent publication. We do not take bookings or guarantee rates.</span>
        </div>
      </div>
    </footer>
  );
}
