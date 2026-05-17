'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { type Locale, localeFlags, t, locales } from '@/lib/i18n';
import { Logo } from './Logo';

export function Header({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const dict = t(locale);

  const base = `/${locale}`;
  const nav = [
    { href: `${base}`, label: dict.nav.home },
    { href: `${base}/menu`, label: dict.nav.menu },
    { href: `${base}/reservation`, label: dict.nav.reservation },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  // Build the equivalent path in the other locales by replacing the leading /xx
  const switchLocalePath = (target: Locale) => {
    const segments = pathname.split('/');
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = target;
      return segments.join('/') || `/${target}`;
    }
    return `/${target}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-bottega-700/95 backdrop-blur-sm shadow-md no-print">
      <div className="container-x flex items-center justify-between py-3">
        <Link href={base} className="flex items-center" aria-label="Le Botteghe">
          <Logo variant="light" size="sm" />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => {
            const active =
              n.href === base
                ? pathname === base || pathname === `${base}/`
                : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`text-xs tracking-widest2 uppercase transition-colors ${
                  active ? 'text-gold-400' : 'text-cream-100 hover:text-gold-400'
                }`}
              >
                {n.label}
              </Link>
            );
          })}
          <Link
            href={`${base}/reservation`}
            className="ml-2 border border-gold-500 px-4 py-2 text-xs uppercase tracking-widest2 text-gold-400 hover:bg-gold-500 hover:text-bottega-900 transition-colors"
          >
            {dict.hero.bookNow}
          </Link>
          <div className="flex items-center gap-1 border-l border-cream-100/20 pl-4 ml-1 text-[11px] uppercase tracking-widest">
            {locales.map((l) => (
              <Link
                key={l}
                href={switchLocalePath(l)}
                className={`px-1.5 py-0.5 ${l === locale ? 'text-gold-400 border-b border-gold-400' : 'text-cream-100/70 hover:text-cream-50'}`}
              >
                {localeFlags[l]}
              </Link>
            ))}
          </div>
        </nav>

        <button
          aria-label="Menu"
          className="md:hidden text-cream-50 p-2"
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-bottega-800 border-t border-cream-100/10">
          <nav className="container-x flex flex-col py-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-cream-100 text-sm uppercase tracking-widest2 border-b border-cream-100/10"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocalePath(l)}
                    onClick={() => setOpen(false)}
                    className={l === locale ? 'text-gold-400 border-b border-gold-400 pb-0.5' : 'text-cream-100/70'}
                  >
                    {localeFlags[l]}
                  </Link>
                ))}
              </div>
              <Link
                href={`${base}/reservation`}
                onClick={() => setOpen(false)}
                className="border border-gold-500 px-4 py-2 text-xs uppercase tracking-widest2 text-gold-400"
              >
                {dict.hero.bookNow}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
