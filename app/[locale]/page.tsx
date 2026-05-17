import Image from 'next/image';
import Link from 'next/link';
import { isLocale, type Locale, t } from '@/lib/i18n';
import { Logo } from '@/components/Logo';
import { notFound } from 'next/navigation';

export default function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);
  const base = `/${locale}`;

  return (
    <>
      {/* Hero */}
      <section className="relative -mt-[72px] h-[100svh] min-h-[560px] w-full overflow-hidden bg-bottega-900">
        {/* Desktop (≥ md): horizontal landscape photo — contained so more of the façade shows */}
        <Image
          src="/images/hero-desktop.jpg"
          alt="Le Botteghe — l'ingresso del ristorante a Matera"
          fill
          priority
          sizes="100vw"
          className="hidden md:block object-contain"
        />
        {/* Mobile: vertical portrait photo */}
        <Image
          src="/images/hero-mobile.jpg"
          alt="Le Botteghe — l'ingresso del ristorante a Matera"
          fill
          priority
          sizes="100vw"
          className="md:hidden object-cover"
        />
        {/* Vignette / gradient overlay — kept lighter on top so the photo reads */}
        <div className="absolute inset-0 bg-gradient-to-b from-bottega-900/15 via-bottega-900/20 to-bottega-900/85" />

        {/* Hero content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 md:pb-28 px-6 text-center max-w-3xl mx-auto [text-shadow:0_2px_18px_rgba(12,24,18,0.7)]">
          <p className="display text-cream-50 text-2xl md:text-4xl font-semibold leading-snug max-w-2xl mx-auto">
            {dict.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center [text-shadow:none]">
            <Link href={`${base}/reservation`} className="btn-gold">
              {dict.hero.bookNow}
            </Link>
            <Link href={`${base}/menu`} className="btn-outline-light">
              {dict.hero.viewMenu}
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-cream-50/70 z-10 animate-bounce">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* About */}
      <section className="bg-cream-50 bg-plaster py-20 md:py-28">
        <div className="container-x text-center max-w-3xl">
          <span className="label">Matera · Sassi</span>
          <h2 className="display text-4xl md:text-5xl mt-3 text-bottega-800">
            {dict.about.title}
          </h2>
          <div className="gold-rule" />
          <p className="text-lg leading-relaxed text-bottega-700/90">
            {dict.about.body}
          </p>
        </div>

        <div className="container-x mt-16">
          <div className="grid gap-10 md:grid-cols-2 max-w-3xl mx-auto">
          {[
            { title: dict.about.featureMare, desc: dict.about.featureMareDesc, icon: (
              <path d="M5 12c2-4 8-4 12 0-4 4-10 4-12 0zm12 0l3-2m-3 2l3 2M9 12h.01" />
            ) },
            { title: dict.about.featureVino, desc: dict.about.featureVinoDesc, icon: (
              <path d="M8 3h8l-1 7a4 4 0 0 1-3 4v6m-2 0h4M9 3l3 11" />
            ) },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full border border-gold-500 flex items-center justify-center text-bottega-700">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  {f.icon}
                </svg>
              </div>
              <h3 className="display text-2xl mt-4 text-bottega-800">{f.title}</h3>
              <p className="mt-2 text-sm text-bottega-700/80 leading-relaxed">{f.desc}</p>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Menu highlight band */}
      <section className="relative bg-bottega-700 text-cream-50 py-20">
        <div className="container-x grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="text-gold-400 text-xs uppercase tracking-widest2">Specialità</span>
            <h2 className="display text-4xl md:text-5xl mt-2">{dict.menu.title}</h2>
            <p className="mt-4 text-cream-100/85 leading-relaxed max-w-md">
              {locale === 'it' && 'Antipasti del territorio, pasta tirata a mano, secondi di terra e di mare, dessert della casa.'}
              {locale === 'de' && 'Regionale Vorspeisen, handgemachte Pasta, Fleisch- und Fischgerichte, hauseigene Desserts.'}
              {locale === 'en' && 'Local appetizers, hand-pulled pasta, meat and fish mains, house-made desserts.'}
            </p>
            <Link href={`${base}/menu`} className="btn-outline-light mt-8">
              {dict.hero.viewMenu}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { name: 'Cavatelli alla Lucana', price: '€ 14' },
              { name: 'Tagliata di Vitello 300gr', price: '€ 22' },
              { name: 'Raviolo di Cernia', price: '€ 19' },
              { name: 'Baccalà alla Lucana', price: '€ 16' },
              { name: 'Parmigiana di Melanzane', price: '€ 14' },
              { name: 'Tiramisù della casa', price: '€ 5' },
            ].map((d) => (
              <div key={d.name} className="border border-cream-50/15 p-4">
                <div className="display text-lg leading-tight">{d.name}</div>
                <div className="text-gold-400 text-xs mt-1">{d.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-100 py-20 text-center">
        <div className="container-x max-w-2xl">
          <span className="label">{dict.reservation.title}</span>
          <h2 className="display text-4xl md:text-5xl mt-3 text-bottega-800">
            {locale === 'it' && 'Riservate la vostra serata'}
            {locale === 'de' && 'Reservieren Sie Ihren Abend'}
            {locale === 'en' && 'Reserve your evening'}
          </h2>
          <div className="gold-rule" />
          <p className="text-bottega-700/85">
            {dict.reservation.info}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`${base}/reservation`} className="btn-primary">{dict.hero.bookNow}</Link>
            <a href="tel:+390835000000" className="btn-outline-dark">+39 0835 000 000</a>
          </div>
        </div>
      </section>
    </>
  );
}
