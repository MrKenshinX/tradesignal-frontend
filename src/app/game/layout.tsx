import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trader Tycoon — Game Simulasi Trading Gratis',
  description: 'Main game simulasi trading gratis! Modal virtual Rp 10 juta, beli & jual koin, kejar profit, jadi sultan trading. Belajar trading tanpa risiko uang nyata.',
  alternates: { canonical: '/game/' },
  openGraph: {
    title: 'Trader Tycoon — Game Trading Seru & Gratis',
    description: 'Beli murah, jual mahal, jadi Dewa Trading! Game simulasi pasar real-time dengan modal virtual.',
    url: 'https://tradesignalpro.web.id/game/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Trader Tycoon Game' }],
  },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
