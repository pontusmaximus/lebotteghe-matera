import { isLocale, type Locale, t } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { ReservationForm } from './ReservationForm';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = t(params.locale as Locale);
  return { title: dict.reservation.title, description: dict.reservation.subtitle };
}

export default function ReservationPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  return (
    <section className="bg-cream-50 bg-plaster min-h-screen py-16">
      <div className="container-x grid gap-12 md:grid-cols-2 max-w-5xl">
        <div>
          <span className="label">{dict.reservation.title}</span>
          <h1 className="display text-4xl md:text-5xl text-bottega-800 mt-2">
            {dict.reservation.title}
          </h1>
          <div className="my-4 h-px w-16 bg-gold-500" />
          <p className="text-bottega-700/85 leading-relaxed">{dict.reservation.subtitle}</p>
          <p className="text-sm text-bottega-700/70 mt-4">{dict.reservation.info}</p>

          <div className="mt-10 border-t border-bottega-100 pt-6">
            <p className="label">{dict.reservation.callUs}</p>
            <a href="tel:+390835000000" className="display text-3xl text-bottega-800 hover:text-gold-600">
              +39 0835 000 000
            </a>
            <p className="text-sm text-bottega-700/70 mt-4 leading-relaxed">
              Via delle Beccherie, 22<br />
              75100 Matera (MT)
            </p>
          </div>
        </div>

        <ReservationForm locale={locale} dict={dict.reservation} />
      </div>
    </section>
  );
}
