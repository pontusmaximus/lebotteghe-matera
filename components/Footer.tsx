import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';
import { Logo } from './Logo';

export function Footer({ locale }: { locale: Locale }) {
  const dict = t(locale);
  const base = `/${locale}`;
  return (
    <footer className="bg-bottega-800 text-cream-100 mt-auto no-print">
      <div className="container-x py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="light" size="md" />
          <p className="mt-5 text-sm leading-relaxed text-cream-100/80 max-w-md">
            {locale === 'it' &&
              'Cucina tipica lucana nel cuore dei Sassi di Matera. Una tappa imperdibile fra tradizione, vino e accoglienza.'}
            {locale === 'de' &&
              'Typisch lukanische Küche im Herzen der Sassi von Matera. Ein unverzichtbarer Halt zwischen Tradition, Wein und Gastfreundschaft.'}
            {locale === 'en' &&
              'Typical Lucanian cuisine in the heart of the Sassi of Matera. A must-stop between tradition, wine and hospitality.'}
          </p>
        </div>

        <div>
          <h4 className="label mb-3">{dict.contact.title}</h4>
          <p className="text-sm leading-relaxed">
            {dict.contact.addressValue}
            <br />
            <a href="tel:+390835000000" className="hover:text-gold-400">+39 0835 000 000</a>
            <br />
            <a href="mailto:info@lebotteghematera.it" className="hover:text-gold-400">info@lebotteghematera.it</a>
          </p>
        </div>

        <div>
          <h4 className="label mb-3">{dict.contact.hours}</h4>
          <p className="text-sm leading-relaxed">
            {dict.contact.hoursValue}
            <br />
            <span className="text-cream-100/60">{dict.contact.closed}</span>
          </p>
          <div className="mt-4 flex gap-3 text-cream-100/70">
            <a href="#" aria-label="Instagram" className="hover:text-gold-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-gold-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 8h-2a1 1 0 0 0-1 1v3h3l-.5 3H12v7h-3v-7H7v-3h2V9a3 3 0 0 1 3-3h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="TripAdvisor" className="hover:text-gold-400">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <circle cx="8.5" cy="12" r="2"/>
                <circle cx="15.5" cy="12" r="2"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cream-100/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream-100/60">
          <span>© {new Date().getFullYear()} {dict.footer.copy} · {dict.footer.vat}</span>
          <Link href={`${base}/admin/login`} className="hover:text-gold-400">
            {dict.footer.adminLogin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
