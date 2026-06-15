import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crypto Arcade — Game Trading Koin Real-Time',
  description: 'Main game simulasi trading gratis! Modal virtual Rp 10 juta, beli & jual koin, kejar profit, jadi sultan trading. Belajar trading tanpa risiko uang nyata.',
  alternates: { canonical: '/game-arcade/' },
  openGraph: {
    title: 'Crypto Arcade — Game Trading Seru & Gratis',
    description: 'Beli murah, jual mahal, jadi Dewa Trading! Game simulasi pasar real-time dengan modal virtual.',
    url: 'https://tradesignalpro.web.id/game-arcade/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Crypto Arcade Game' }],
  },
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
