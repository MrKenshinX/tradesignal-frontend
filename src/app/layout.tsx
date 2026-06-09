import type { Metadata, Viewport } from 'next';
import './globals.css';
import Script from 'next/script';

export const metadata: Metadata = {
  title: {
    default: 'TradeSignal Pro — Sinyal Trading IDN, Saham Asing & Crypto Real-Time',
    template: '%s | TradeSignal Pro',
  },
  description: 'Platform sinyal trading otomatis berbasis AI untuk saham Indonesia, saham asing, dan cryptocurrency. RSI, MACD, Bollinger Bands. Auto SL/TP. Data real-time 24/7.',
  keywords: ['sinyal trading', 'trading signal', 'saham indonesia', 'crypto trading', 'analisis teknikal', 'RSI MACD'],
  openGraph: {
    title: 'TradeSignal Pro — Sinyal Trading Real-Time',
    description: 'Sinyal trading otomatis berbasis AI. Saham IDN, Asing & Crypto.',
    url: 'https://tradesignalpro.web.id',
    siteName: 'TradeSignal Pro',
    locale: 'id_ID',
    type: 'website',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060B18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Orbitron:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#060B18] text-[#E8F4FD]">
        {children}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-NNLKLQW8X4" strategy="afterInteractive" />
        <Script id="gtag" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-NNLKLQW8X4');`}
        </Script>
      </body>
    </html>
  );
}
