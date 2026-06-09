'use client';
import { Zap, BarChart2, Shield, Clock, TrendingUp, Globe, Bell, Lock } from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Sinyal Otomatis AI',
    description: 'Engine berjalan 24/7 menganalisis 150+ instrumen dengan RSI, MACD, Bollinger Bands, Stochastic, dan EMA secara simultan.',
    color: 'cyan',
    badge: 'Core Feature',
  },
  {
    icon: Shield,
    title: 'Auto Stop-Loss & Take-Profit',
    description: 'SL/TP dihitung otomatis berbasis ATR (Average True Range) untuk manajemen risiko yang terukur dan konsisten.',
    color: 'green',
  },
  {
    icon: BarChart2,
    title: 'Confidence Score 0-100',
    description: 'Setiap sinyal dilengkapi skor kepercayaan berdasarkan konvergensi multi-indikator. Semakin tinggi, semakin kuat sinyalnya.',
    color: 'purple',
  },
  {
    icon: Globe,
    title: 'Multi-Market Coverage',
    description: 'Saham IDN (BEI), Saham Asing (NYSE/NASDAQ), dan Cryptocurrency top 50. Semua dalam satu platform.',
    color: 'gold',
  },
  {
    icon: Clock,
    title: 'Data Real-Time',
    description: 'Yahoo Finance, Finnhub, dan Binance WebSocket. Data harga diperbarui setiap beberapa detik untuk crypto.',
    color: 'cyan',
  },
  {
    icon: Bell,
    title: 'Push Notification',
    description: 'Notifikasi instan ke HP kamu saat sinyal baru muncul. Tidak perlu terus-terusan memantau layar.',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    title: 'Portfolio Tracker',
    description: 'Pantau P&L real-time untuk semua posisi terbuka. Unrealized gain/loss selalu update otomatis.',
    color: 'green',
  },
  {
    icon: Lock,
    title: 'Screener Canggih',
    description: 'Filter 150+ instrumen berdasarkan RSI, volume, perubahan harga, market cap, dan banyak parameter teknikal lainnya.',
    color: 'gold',
  },
];

const iconColors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  cyan: { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/20', glow: 'group-hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]' },
  purple: { text: 'text-[#7B2FFF]', bg: 'bg-[#7B2FFF]/10', border: 'border-[#7B2FFF]/20', glow: 'group-hover:shadow-[0_0_20px_rgba(123,47,255,0.3)]' },
  green: { text: 'text-[#00E676]', bg: 'bg-[#00E676]/10', border: 'border-[#00E676]/20', glow: 'group-hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]' },
  gold: { text: 'text-[#FFD700]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/20', glow: 'group-hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]' },
};

export function FeaturesSection() {
  return (
    <section className="relative py-24 bg-[#060B18]" id="features">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />

      {/* Decorative orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7B2FFF]/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 text-[#7B2FFF] text-xs font-semibold mb-4">
            <Zap size={12} /> Fitur Platform
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Semua yang Kamu Butuhkan<br />
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">dalam Satu Platform</span>
          </h2>
          <p className="max-w-2xl mx-auto text-[#8BA8C2] text-lg">
            Dari sinyal otomatis hingga manajemen portfolio — TradeSignal Pro memberikan edge yang dibutuhkan trader profesional.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            const c = iconColors[feature.color];
            return (
              <div
                key={i}
                className={`group relative p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-card cursor-default`}
              >
                {feature.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-mono font-bold text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/20 px-2 py-0.5 rounded-full">
                    {feature.badge}
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl border ${c.bg} ${c.border} ${c.glow} flex items-center justify-center mb-4 transition-all duration-300`}>
                  <Icon size={18} className={c.text} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-[#8BA8C2] text-xs leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
