import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { BookOpen, TrendingUp, BarChart2, Shield, Zap, Target } from 'lucide-react';

export const metadata = { title: 'Edukasi Trading' };

const MODULES = [
  {
    icon: BookOpen,
    color: 'text-[#00D4FF]',
    bg: 'bg-[#00D4FF]/10',
    border: 'border-[#00D4FF]/20',
    title: 'Dasar Trading untuk Pemula',
    desc: 'Pelajari konsep dasar trading saham, cara membaca chart, dan terminologi penting yang harus kamu ketahui.',
    topics: ['Apa itu saham & trading', 'Cara membaca candlestick', 'Support & Resistance', 'Timeframe trading'],
    level: 'Pemula',
  },
  {
    icon: BarChart2,
    color: 'text-[#7B2FFF]',
    bg: 'bg-[#7B2FFF]/10',
    border: 'border-[#7B2FFF]/20',
    title: 'Analisis Teknikal',
    desc: 'Kuasai indikator teknikal yang digunakan TradeSignal Pro — RSI, MACD, Bollinger Bands, dan EMA.',
    topics: ['RSI — Relative Strength Index', 'MACD — Moving Average Convergence', 'Bollinger Bands', 'EMA 20/50/200'],
    level: 'Menengah',
  },
  {
    icon: Shield,
    color: 'text-[#00E676]',
    bg: 'bg-[#00E676]/10',
    border: 'border-[#00E676]/20',
    title: 'Manajemen Risiko',
    desc: 'Pelajari cara mengelola risiko dengan benar — Stop Loss, Take Profit, dan position sizing.',
    topics: ['Pentingnya Stop Loss', 'Menghitung Risk/Reward Ratio', 'ATR untuk SL/TP', 'Position Sizing'],
    level: 'Menengah',
  },
  {
    icon: TrendingUp,
    color: 'text-[#FFD700]',
    bg: 'bg-[#FFD700]/10',
    border: 'border-[#FFD700]/20',
    title: 'Strategi Swing Trading',
    desc: 'Strategi trading jangka menengah yang cocok untuk trader yang tidak bisa full-time monitor market.',
    topics: ['Apa itu Swing Trading', 'Mencari entry & exit point', 'Trend following strategy', 'Menggunakan sinyal TradeSignal Pro'],
    level: 'Menengah',
  },
  {
    icon: Zap,
    color: 'text-[#FF4757]',
    bg: 'bg-[#FF4757]/10',
    border: 'border-[#FF4757]/20',
    title: 'Trading Crypto',
    desc: 'Panduan trading cryptocurrency — dari Bitcoin hingga altcoin, dengan strategi yang terbukti.',
    topics: ['Perbedaan crypto vs saham', 'Volatilitas & peluang crypto', 'DCA vs Trading aktif', 'Keamanan aset crypto'],
    level: 'Menengah',
  },
  {
    icon: Target,
    color: 'text-[#00D4FF]',
    bg: 'bg-[#00D4FF]/10',
    border: 'border-[#00D4FF]/20',
    title: 'Membaca Sinyal TradeSignal Pro',
    desc: 'Panduan lengkap cara membaca dan menggunakan sinyal dari platform kami secara efektif.',
    topics: ['Memahami Confidence Score', 'Cara eksekusi sinyal BUY/SELL', 'Menggunakan Auto SL/TP', 'Kombinasi multi-sinyal'],
    level: 'Semua Level',
  },
];

const LEVEL_COLORS: Record<string, string> = {
  'Pemula': 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30',
  'Menengah': 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30',
  'Semua Level': 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
};

export default function EdukasiPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 text-[#7B2FFF] text-xs font-semibold mb-4">
              <BookOpen size={12} /> Pusat Edukasi Trading
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Belajar Trading<br />
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">dari Nol hingga Mahir</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#8BA8C2] text-lg">
              Materi edukasi trading lengkap — dari dasar hingga strategi advanced. Gratis untuk semua pengguna.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-card flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${m.bg} border ${m.border} flex items-center justify-center`}>
                      <Icon size={18} className={m.color} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLORS[m.level]}`}>
                      {m.level}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">{m.title}</h3>
                  <p className="text-[#8BA8C2] text-xs leading-relaxed mb-4 flex-1">{m.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {m.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-xs text-[#8BA8C2]">
                        <span className={`w-1 h-1 rounded-full ${m.color.replace('text-', 'bg-')}`} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2.5 rounded-xl border ${m.border} ${m.color} text-xs font-semibold hover:${m.bg} transition-all`}>
                    Mulai Belajar →
                  </button>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <h2 className="text-white font-bold text-xl mb-2">Siap Mulai Trading?</h2>
            <p className="text-[#8BA8C2] text-sm mb-6">Terapkan ilmu yang kamu pelajari dengan sinyal real-time dari TradeSignal Pro</p>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
              <Zap size={16} fill="white" /> Mulai Gratis Sekarang
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
