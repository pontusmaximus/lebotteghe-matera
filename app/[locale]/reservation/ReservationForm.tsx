'use client';
import { useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n';
import { submitReservation } from './actions';

type Dict = {
  name: string; email: string; phone: string; date: string; time: string;
  guests: string; notes: string; submit: string; submitting: string;
  success: string; error: string; requiredFields: string;
};

export function ReservationForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set('language', locale);
    startTransition(async () => {
      const res = await submitReservation(form);
      if (res.ok) {
        setStatus('ok');
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus('error');
        setErrorMsg(res.error || dict.error);
      }
    });
  }

  if (status === 'ok') {
    return (
      <div className="bg-bottega-700 text-cream-50 p-10 text-center">
        <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" d="m8 12 3 3 5-6" />
        </svg>
        <p className="display text-2xl">{dict.success}</p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 underline text-sm text-cream-100/80 hover:text-gold-400"
        >
          {locale === 'it' ? 'Nuova prenotazione' : locale === 'de' ? 'Neue Reservierung' : 'New booking'}
        </button>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-bottega-100 p-6 md:p-8 shadow-sm">
      <div className="grid gap-4">
        <div>
          <label htmlFor="name" className="label block mb-1.5">{dict.name} *</label>
          <input id="name" name="name" required className="field" autoComplete="name" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="label block mb-1.5">{dict.email} *</label>
            <input id="email" name="email" type="email" required className="field" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="phone" className="label block mb-1.5">{dict.phone} *</label>
            <input id="phone" name="phone" type="tel" required className="field" autoComplete="tel" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="label block mb-1.5">{dict.date} *</label>
            <input id="date" name="date" type="date" required min={today} className="field" />
          </div>
          <div>
            <label htmlFor="time" className="label block mb-1.5">{dict.time} *</label>
            <select id="time" name="time" required className="field">
              <option value="">--</option>
              {['12:00','12:30','13:00','13:30','14:00','14:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'].map((tm) => (
                <option key={tm} value={tm}>{tm}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="guests" className="label block mb-1.5">{dict.guests} *</label>
            <select id="guests" name="guests" required className="field" defaultValue="2">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="label block mb-1.5">{dict.notes}</label>
          <textarea id="notes" name="notes" rows={3} className="field resize-none" />
        </div>

        {status === 'error' && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? dict.submitting : dict.submit}
        </button>
      </div>
    </form>
  );
}
