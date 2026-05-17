import { isLocale, type Locale, t, formatPrice, allergenList } from '@/lib/i18n';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = t(params.locale as Locale);
  return { title: dict.menu.title, description: dict.menu.subtitle };
}

function name(item: { nameIt: string; nameEn: string; nameDe: string }, l: Locale) {
  return l === 'it' ? item.nameIt : l === 'de' ? item.nameDe : item.nameEn;
}
function desc(item: { descIt: string | null; descEn: string | null; descDe: string | null }, l: Locale) {
  return l === 'it' ? item.descIt : l === 'de' ? item.descDe : item.descEn;
}

export default async function MenuPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      items: {
        where: { available: true },
        orderBy: { order: 'asc' },
      },
    },
  });

  return (
    <>
      {/* Page intro */}
      <section className="bg-bottega-700 text-cream-50 py-16">
        <div className="container-x text-center">
          <span className="text-gold-400 text-xs uppercase tracking-widest2">Le Botteghe</span>
          <h1 className="display text-5xl md:text-6xl mt-2">{dict.menu.title}</h1>
          <div className="gold-rule" />
          <p className="text-cream-100/85 max-w-xl mx-auto">{dict.menu.subtitle}</p>
        </div>
      </section>

      {/* Category nav */}
      <nav className="sticky top-[72px] z-30 bg-cream-50/95 backdrop-blur border-b border-bottega-100 no-print">
        <div className="container-x flex gap-1 overflow-x-auto py-3 text-xs uppercase tracking-widest2">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.slug}`}
              className="px-3 py-2 whitespace-nowrap text-bottega-700 hover:text-gold-600 hover:bg-bottega-50"
            >
              {name(c, locale)}
            </a>
          ))}
        </div>
      </nav>

      <section className="bg-cream-50 bg-plaster py-16">
        <div className="container-x grid gap-12">
          {categories.map((cat) => (
            <article key={cat.id} id={cat.slug} className="menu-card p-8 md:p-12 scroll-mt-40">
              <header className="text-center mb-8">
                <h2 className="display text-3xl md:text-4xl text-bottega-800">{name(cat, locale)}</h2>
                <div className="gold-rule" />
              </header>

              {cat.items.length === 0 ? (
                <p className="text-center text-bottega-700/60 italic">{dict.menu.noItems}</p>
              ) : (
                <ul className="grid gap-5 md:grid-cols-2">
                  {cat.items.map((item) => {
                    const d = desc(item, locale);
                    const allergens = item.allergens
                      ? item.allergens.split(',').map((a) => a.trim()).filter(Boolean)
                      : [];
                    return (
                      <li key={item.id} className="border-b border-bottega-100 pb-4">
                        <div className="flex items-baseline justify-between gap-4">
                          <h3 className="display text-xl text-bottega-800 leading-snug">
                            {name(item, locale)}
                            {item.isFrozen && <span className="text-gold-500 align-super text-xs"> *</span>}
                          </h3>
                          <span className="display text-lg text-bottega-700 whitespace-nowrap">
                            {formatPrice(item.priceCents, locale)}
                          </span>
                        </div>
                        {d && (
                          <p className="text-sm text-bottega-700/75 italic mt-1.5 leading-relaxed">{d}</p>
                        )}
                        {allergens.length > 0 && (
                          <p className="mt-1 text-[11px] text-bottega-700/60">
                            <span className="uppercase tracking-widest mr-1">{dict.menu.allergens}:</span>
                            {allergens.join(' · ')}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          ))}

          {/* Coperto */}
          <div className="text-center py-8">
            <p className="text-sm text-bottega-700/75">
              <strong className="uppercase tracking-widest mr-2">{dict.menu.coperto}</strong>
              {dict.menu.coperto_amount}
              <span className="text-bottega-700/50"> — {dict.menu.coperto_note}</span>
            </p>
            <p className="text-xs text-bottega-700/60 mt-2">{dict.menu.frozen}</p>
          </div>

          {/* Allergen legend */}
          <article className="menu-card p-8 md:p-10">
            <h2 className="display text-2xl text-bottega-800 text-center">{dict.menu.legendTitle}</h2>
            <div className="gold-rule" />
            <ol className="grid gap-2 md:grid-cols-2 text-sm text-bottega-700/85 list-decimal list-inside">
              {allergenList.map((a, i) => (
                <li key={i}>{locale === 'it' ? a.it : locale === 'de' ? a.de : a.en}</li>
              ))}
            </ol>
          </article>

          <div className="text-center no-print">
            <button type="button" data-print className="btn-outline-dark print:hidden">
              {dict.menu.printMenu}
            </button>
          </div>
        </div>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html:
            "document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));",
        }}
      />
    </>
  );
}
