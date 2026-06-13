import type { MetadataRoute } from 'next';

const BASE = 'https://tradesignalpro.web.id';

const BLOG_SLUGS = [
  'cara-membaca-sinyal-trading',
  'indikator-rsi-untuk-pemula',
  'macd-trading-signal',
  'stop-loss-take-profit-optimal',
  'saham-bluechip-indonesia',
  'strategi-swing-trading',
  'strategi-crypto-trading',
  'dividen-saham-idx-terbaik',
  'panduan-trading-pemula',
];

const EDUKASI_SLUGS = [
  'dasar-trading',
  'analisis-teknikal',
  'manajemen-risiko',
  'swing-trading',
  'trading-crypto',
  'membaca-sinyal',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ['', '/blog', '/edukasi', '/contact', '/privacy', '/terms', '/disclaimer', '/auth/login', '/auth/register'];

  return [
    ...staticPages.map((p) => ({
      url: `${BASE}${p}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.7,
    })),
    ...BLOG_SLUGS.map((s) => ({
      url: `${BASE}/blog/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...EDUKASI_SLUGS.map((s) => ({
      url: `${BASE}/edukasi/${s}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
