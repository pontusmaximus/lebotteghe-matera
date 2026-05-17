import { isLocale, type Locale, t } from '@/lib/i18n';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoginForm } from './LoginForm';

export default async function AdminLoginPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = t(locale);

  const session = await getSession();
  if (session) redirect(`/${locale}/admin`);

  return (
    <section className="bg-bottega-800 min-h-screen flex items-center justify-center p-6">
      <div className="bg-cream-50 w-full max-w-md p-8 md:p-10 shadow-xl">
        <div className="text-center">
          <span className="label">{dict.admin.title}</span>
          <h1 className="display text-3xl text-bottega-800 mt-2">{dict.admin.loginTitle}</h1>
          <div className="gold-rule" />
        </div>
        <LoginForm locale={locale} dict={dict.admin} />
      </div>
    </section>
  );
}
