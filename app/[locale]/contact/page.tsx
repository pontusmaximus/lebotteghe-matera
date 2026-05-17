import { isLocale, type Locale, t } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = t(params.locale as Locale);
  return { title: dict.contact.title };
}

export default function ContactPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  return (
    <section className="bg-cream-50 bg-plaster py-16 min-h-screen">
      <div className="container-x">
        <header className="text-center max-w-2xl mx-auto">
          <span className="label">Le Botteghe · Matera</span>
          <h1 className="display text-5xl text-bottega-800 mt-2">{dict.contact.title}</h1>
          <div className="gold-rule" />
        </header>

        <div className="grid gap-10 md:grid-cols-3 mt-12">
          <div className="text-center p-6 menu-card">
            <div className="mx-auto w-12 h-12 rounded-full border border-gold-500 flex items-center justify-center text-bottega-700">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21s-7-7.4-7-12a7 7 0 0 1 14 0c0 4.6-7 12-7 12z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <h3 className="display text-xl mt-3 text-bottega-800">{dict.contact.address}</h3>
            <p className="text-sm text-bottega-700/85 mt-2">{dict.contact.addressValue}</p>
          </div>

          <div className="text-center p-6 menu-card">
            <div className="mx-auto w-12 h-12 rounded-full border border-gold-500 flex items-center justify-center text-bottega-700">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>
              </svg>
            </div>
            <h3 className="display text-xl mt-3 text-bottega-800">{dict.contact.phone}</h3>
            <a href="tel:+390835000000" className="block text-sm text-bottega-700 hover:text-gold-600 mt-2">+39 0835 000 000</a>
            <a href="mailto:info@lebotteghematera.it" className="block text-sm text-bottega-700 hover:text-gold-600 mt-1">info@lebotteghematera.it</a>
          </div>

          <div className="text-center p-6 menu-card">
            <div className="mx-auto w-12 h-12 rounded-full border border-gold-500 flex items-center justify-center text-bottega-700">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 2"/>
              </svg>
            </div>
            <h3 className="display text-xl mt-3 text-bottega-800">{dict.contact.hours}</h3>
            <p className="text-sm text-bottega-700/85 mt-2">{dict.contact.hoursValue}</p>
            <p className="text-xs text-bottega-700/60 mt-1">{dict.contact.closed}</p>
          </div>
        </div>

        <div className="mt-12">
          <h3 className="display text-2xl text-center text-bottega-800">{dict.contact.mapTitle}</h3>
          <div className="gold-rule" />
          <div className="overflow-hidden border border-bottega-100 shadow-sm">
            <iframe
              title="Matera map"
              className="w-full h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=16.6075%2C40.6620%2C16.6135%2C40.6680&layer=mapnik&marker=40.6650%2C16.6105"
            />
          </div>
          <p className="text-center text-xs text-bottega-700/60 mt-3">
            <a
              className="underline hover:text-gold-600"
              href="https://www.openstreetmap.org/?mlat=40.665&mlon=16.6105#map=17/40.6650/16.6105"
              target="_blank"
              rel="noreferrer noopener"
            >
              {locale === 'it' ? 'Apri in OpenStreetMap' : locale === 'de' ? 'In OpenStreetMap öffnen' : 'Open in OpenStreetMap'}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
