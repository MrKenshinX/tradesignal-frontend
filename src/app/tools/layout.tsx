import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kalkulator Trading — Position Sizing, Risk/Reward, Profit/Loss',
  description: 'Kalkulator trading gratis: hitung position sizing, rasio risk/reward, profit/loss dengan fee broker, dan proyeksi compounding. Untuk manajemen risiko saham & crypto.',
  alternates: { canonical: '/tools/' },
  openGraph: {
    title: 'Kalkulator Trading Gratis — TradeSignal Pro',
    description: 'Hitung position sizing, risk/reward, profit/loss, dan compounding untuk trading saham & crypto.',
    url: 'https://tradesignalpro.web.id/tools/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Kalkulator Trading' }],
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
