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

export const metadata: Metadata = {
  metadataBase: new URL('https://lebotteghematera.it'),
  title: {
    default: 'Le Botteghe — Arrosto, Vino e Cucina · Matera',
    template: '%s · Le Botteghe Matera',
  },
  description:
    'Le Botteghe — cucina tipica lucana nel cuore dei Sassi di Matera. Pasta fresca, carni e pesce del territorio, vini lucani. Prenota il tuo tavolo online.',
  keywords: [
    'Le Botteghe Matera', 'ristorante Matera', 'cucina lucana', 'Sassi di Matera',
    'pasta fresca Matera', 'restaurant Matera', 'Restaurant Matera',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Le Botteghe Matera',
    title: 'Le Botteghe — Arrosto, Vino e Cucina',
    description: 'Cucina tipica lucana nel cuore dei Sassi di Matera.',
    locale: 'it_IT',
    images: ['/images/hero-desktop.jpg'],
  },
  alternates: {
    canonical: '/',
    languages: { it: '/', de: '/de', en: '/en' },
  },
  icons: {
    icon: '/favicon.svg',
  },
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
