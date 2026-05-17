'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale } from '@/lib/i18n';
import { signIn } from './actions';

type Dict = {
  email: string; password: string; signIn: string; signingIn: string; invalid: string;
};

export function LoginForm({ locale, dict }: { locale: Locale; dict: Dict }) {
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await signIn(fd);
      if (res.ok) {
        router.push(`/${locale}/admin`);
        router.refresh();
      } else {
        setError(dict.invalid);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-4">
      <div>
        <label htmlFor="email" className="label block mb-1.5">{dict.email}</label>
        <input id="email" name="email" type="email" required className="field" autoFocus />
      </div>
      <div>
        <label htmlFor="password" className="label block mb-1.5">{dict.password}</label>
        <input id="password" name="password" type="password" required className="field" />
      </div>
      {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
      <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-60">
        {isPending ? dict.signingIn : dict.signIn}
      </button>
    </form>
  );
}
