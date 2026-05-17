import { isLocale, type Locale, t } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MenuEditor } from './MenuEditor';

export const dynamic = 'force-dynamic';

export default async function AdminMenuPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  const categories = await prisma.menuCategory.findMany({
    orderBy: { order: 'asc' },
    include: { items: { orderBy: { order: 'asc' } } },
  });

  return (
    <div className="container-x py-10">
      <header className="mb-8">
        <span className="label">{dict.admin.dashboard}</span>
        <h1 className="display text-3xl text-bottega-800 mt-1">{dict.admin.menuMgmt}</h1>
      </header>

      <MenuEditor locale={locale} categories={categories} />
    </div>
  );
}
