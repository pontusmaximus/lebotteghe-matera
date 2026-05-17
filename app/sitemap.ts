import type { MetadataRoute } from 'next';
import { locales } from '@/lib/i18n';

const base = process.env.SITE_URL || 'https://lebotteghematera.it';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/menu', '/reservation', '/contact'];
  return locales.flatMap((l) =>
    paths.map((p) => ({
      url: `${base}/${l}${p}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1.0 : 0.7,
    })),
  );
}
