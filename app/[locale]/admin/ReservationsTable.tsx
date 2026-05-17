'use client';
import { useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n';
import { t } from '@/lib/i18n';
import { updateReservationStatus, deleteReservation } from './actions';

type R = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  notes: string | null;
  language: string;
  status: string;
  createdAt: string;
};

export function ReservationsTable({ locale, initial }: { locale: Locale; initial: R[] }) {
  const dict = t(locale);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [rows, setRows] = useState(initial);
  const [, startTransition] = useTransition();

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  const fmt = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale === 'de' ? 'de-DE' : 'it-IT', {
    weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  function setStatus(id: string, status: R['status']) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    startTransition(async () => {
      await updateReservationStatus(id, status as any);
    });
  }
  function remove(id: string) {
    if (!confirm(locale === 'it' ? 'Eliminare la prenotazione?' : locale === 'de' ? 'Reservierung löschen?' : 'Delete reservation?')) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    startTransition(async () => { await deleteReservation(id); });
  }

  return (
    <div className="bg-white border border-bottega-100">
      <div className="flex items-center gap-2 p-3 border-b border-bottega-100 text-xs uppercase tracking-widest">
        {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 border ${filter === f ? 'bg-bottega-700 text-cream-50 border-bottega-700' : 'border-bottega-200 text-bottega-700 hover:bg-bottega-50'}`}
          >
            {f === 'all' ? (locale === 'it' ? 'Tutte' : locale === 'de' ? 'Alle' : 'All') :
             f === 'pending' ? dict.admin.pending :
             f === 'confirmed' ? dict.admin.confirmed :
             dict.admin.cancelled}
          </button>
        ))}
        <span className="ml-auto text-bottega-700/60">{filtered.length}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bottega-50 text-left text-xs uppercase tracking-widest text-bottega-700/70">
            <tr>
              <th className="px-3 py-2">{dict.reservation.date}</th>
              <th className="px-3 py-2">{dict.reservation.name}</th>
              <th className="px-3 py-2">{dict.reservation.guests}</th>
              <th className="px-3 py-2">{dict.reservation.email}/{dict.reservation.phone}</th>
              <th className="px-3 py-2">{dict.reservation.notes}</th>
              <th className="px-3 py-2">{dict.admin.status}</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-3 py-10 text-center text-bottega-700/60">
                {locale === 'it' ? 'Nessuna prenotazione' : locale === 'de' ? 'Keine Reservierungen' : 'No reservations'}
              </td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-bottega-100 align-top hover:bg-bottega-50/30">
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="font-medium text-bottega-800">{fmt.format(new Date(r.date))}</div>
                  <div className="text-xs uppercase text-bottega-700/50 mt-0.5">{r.language}</div>
                </td>
                <td className="px-3 py-3">{r.name}</td>
                <td className="px-3 py-3 text-center font-medium">{r.guests}</td>
                <td className="px-3 py-3 text-xs">
                  <a href={`mailto:${r.email}`} className="block text-bottega-700 hover:text-gold-600">{r.email}</a>
                  <a href={`tel:${r.phone}`} className="block text-bottega-700 hover:text-gold-600">{r.phone}</a>
                </td>
                <td className="px-3 py-3 text-xs text-bottega-700/85 max-w-xs">{r.notes || '—'}</td>
                <td className="px-3 py-3">
                  <span className={`inline-block px-2 py-0.5 text-[11px] uppercase tracking-widest border ${
                    r.status === 'confirmed' ? 'bg-bottega-100 border-bottega-300 text-bottega-800' :
                    r.status === 'cancelled' ? 'bg-red-50 border-red-200 text-red-700' :
                    'bg-gold-500/15 border-gold-500/40 text-gold-600'
                  }`}>
                    {r.status === 'confirmed' ? dict.admin.confirmed : r.status === 'cancelled' ? dict.admin.cancelled : dict.admin.pending}
                  </span>
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  {r.status !== 'confirmed' && (
                    <button onClick={() => setStatus(r.id, 'confirmed')} className="text-xs uppercase tracking-widest text-bottega-700 hover:text-gold-600 mr-3">
                      {dict.admin.confirm}
                    </button>
                  )}
                  {r.status !== 'cancelled' && (
                    <button onClick={() => setStatus(r.id, 'cancelled')} className="text-xs uppercase tracking-widest text-bottega-700 hover:text-gold-600 mr-3">
                      {dict.admin.reject}
                    </button>
                  )}
                  <button onClick={() => remove(r.id)} className="text-xs uppercase tracking-widest text-red-700 hover:text-red-900">
                    {dict.admin.delete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
