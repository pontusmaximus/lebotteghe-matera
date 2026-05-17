import type { MetadataRoute } from 'next';

const base = process.env.SITE_URL || 'https://lebotteghematera.it';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/it/admin', '/de/admin', '/en/admin'] }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
