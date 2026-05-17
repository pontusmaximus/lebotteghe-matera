import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// Pick the public URL in this order:
// 1. SITE_URL (set explicitly once the custom domain is live)
// 2. Vercel's auto-injected production URL
// 3. localhost fallback for dev
const siteUrl =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000');

const title = 'Le Botteghe — Arrosto, Vino e Cucina · Matera';
const description =
  'Cucina tipica lucana nel cuore dei Sassi di Matera. Pasta fresca, carni e pesce del territorio, vini lucani. Prenota il tuo tavolo online.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: '%s · Le Botteghe Matera' },
  description,
  keywords: [
    'Le Botteghe Matera', 'ristorante Matera', 'cucina lucana', 'Sassi di Matera',
    'pasta fresca Matera', 'restaurant Matera', 'Restaurant Matera',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Le Botteghe Matera',
    title,
    description,
    locale: 'it_IT',
    alternateLocale: ['de_DE', 'en_US'],
    url: siteUrl,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Le Botteghe — l\'ingresso del ristorante a Matera',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/og-image.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: { it: '/it', de: '/de', en: '/en' },
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
