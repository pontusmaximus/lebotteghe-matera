import Link from 'next/link';
import { headers } from 'next/headers';
import { isLocale, type Locale, t } from '@/lib/i18n';
import { destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function logoutAction() {
  'use server';
  destroySession();
  redirect('/');
}

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) redirect('/');
  const locale = params.locale as Locale;
  const dict = t(locale);
  const base = `/${locale}/admin`;

  const pathname = headers().get('x-pathname') || '';
  const isLogin = pathname.endsWith('/admin/login');

  return (
    <div className="min-h-screen bg-bottega-50 flex flex-col">
      {!isLogin && (
        <nav className="bg-bottega-800 text-cream-100 no-print">
          <div className="container-x flex items-center justify-between py-3 gap-4 flex-wrap">
            <div className="flex items-center gap-6">
              <Link href={base} className="display text-lg tracking-widest text-cream-50">
                LE BOTTEGHE
                <span className="text-gold-400 text-xs ml-2 uppercase tracking-widest2">
                  {dict.admin.dashboard}
                </span>
              </Link>
              <Link href={base} className="text-xs uppercase tracking-widest2 hover:text-gold-400">
                {dict.admin.reservationsMgmt}
              </Link>
              <Link href={`${base}/menu`} className="text-xs uppercase tracking-widest2 hover:text-gold-400">
                {dict.admin.menuMgmt}
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} className="text-xs uppercase tracking-widest2 hover:text-gold-400">
                ← {locale === 'it' ? 'Sito' : locale === 'de' ? 'Webseite' : 'Website'}
              </Link>
              <form action={logoutAction}>
                <button className="text-xs uppercase tracking-widest2 text-cream-100 hover:text-gold-400">
                  {dict.admin.logout}
                </button>
              </form>
            </div>
          </div>
        </nav>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}
