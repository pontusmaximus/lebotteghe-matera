import { isLocale, type Locale, t } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ReservationsTable } from './ReservationsTable';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  const [pending, confirmed, todayCount, upcoming] = await Promise.all([
    prisma.reservation.count({ where: { status: 'pending' } }),
    prisma.reservation.count({ where: { status: 'confirmed' } }),
    prisma.reservation.count({
      where: {
        date: { gte: startOfToday(), lt: endOfToday() },
        status: { not: 'cancelled' },
      },
    }),
    prisma.reservation.findMany({
      where: { date: { gte: new Date(Date.now() - 3 * 60 * 60 * 1000) } },
      orderBy: [{ status: 'asc' }, { date: 'asc' }],
      take: 200,
    }),
  ]);

  return (
    <div className="container-x py-10">
      <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
        <div>
          <span className="label">{dict.admin.dashboard}</span>
          <h1 className="display text-3xl text-bottega-800 mt-1">
            {dict.admin.reservationsMgmt}
          </h1>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Stat label={dict.admin.pending} value={pending} accent="text-gold-600" />
        <Stat label={dict.admin.confirmed} value={confirmed} accent="text-bottega-700" />
        <Stat
          label={locale === 'it' ? 'Oggi' : locale === 'de' ? 'Heute' : 'Today'}
          value={todayCount}
          accent="text-bottega-800"
        />
      </div>

      <ReservationsTable locale={locale} initial={upcoming.map(serialize)} />
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="bg-white border border-bottega-100 p-5">
      <div className="text-xs uppercase tracking-widest text-bottega-700/70">{label}</div>
      <div className={`display text-4xl mt-1 ${accent}`}>{value}</div>
    </div>
  );
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}
function serialize(r: any) {
  return { ...r, date: r.date.toISOString(), createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString() };
}
