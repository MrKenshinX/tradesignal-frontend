import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { BookOpen, TrendingUp, BarChart2, Shield, Zap, Target, ChevronRight, Clock, Users } from 'lucide-react';

export const metadata = { title: 'Edukasi Trading' };

const MODULES = [
  {
    slug: 'dasar-trading',
    icon: BookOpen,
    color: 'cyan',
    title: 'Dasar Trading untuk Pemula',
    desc: 'Pelajari konsep dasar trading saham, cara membaca chart, dan terminologi penting.',
    topics: ['Apa itu saham & trading', 'Cara membaca candlestick', 'Support & Resistance', 'Timeframe trading'],
    level: 'Pemula',
    duration: '45 menit',
    students: '2.4K',
  },
  {
    slug: 'analisis-teknikal',
    icon: BarChart2,
    color: 'purple',
    title: 'Analisis Teknikal',
    desc: 'Kuasai indikator teknikal RSI, MACD, Bollinger Bands, dan EMA yang digunakan TradeSignal Pro.',
    topics: ['RSI — Relative Strength Index', 'MACD & Signal Line', 'Bollinger Bands', 'EMA 20/50/200'],
    level: 'Menengah',
    duration: '1.5 jam',
    students: '1.8K',
  },
  {
    slug: 'manajemen-risiko',
    icon: Shield,
    color: 'green',
    title: 'Manajemen Risiko',
    desc: 'Pelajari cara mengelola risiko dengan Stop Loss, Take Profit, dan position sizing yang tepat.',
    topics: ['Pentingnya Stop Loss', 'Risk/Reward Ratio', 'ATR untuk SL/TP', 'Position Sizing'],
    level: 'Menengah',
    duration: '1 jam',
    students: '1.5K',
  },
  {
    slug: 'swing-trading',
    icon: TrendingUp,
    color: 'gold',
    title: 'Strategi Swing Trading',
    desc: 'Strategi trading jangka menengah yang cocok untuk trader yang tidak bisa full-time.',
    topics: ['Apa itu Swing Trading', 'Mencari entry & exit', 'Trend following', 'Menggunakan TradeSignal Pro'],
    level: 'Menengah',
    duration: '1.5 jam',
    students: '980',
  },
  {
    slug: 'trading-crypto',
    icon: Zap,
    color: 'red',
    title: 'Trading Cryptocurrency',
    desc: 'Panduan trading crypto — dari Bitcoin hingga altcoin, dengan strategi yang terbukti profitable.',
    topics: ['Crypto vs saham', 'Volatilitas & peluang', 'DCA vs Trading aktif', 'Keamanan aset'],
    level: 'Menengah',
    duration: '2 jam',
    students: '1.2K',
  },
  {
    slug: 'membaca-sinyal',
    icon: Target,
    color: 'cyan',
    title: 'Membaca Sinyal TradeSignal Pro',
    desc: 'Panduan lengkap cara membaca dan menggunakan sinyal dari platform kami secara efektif.',
    topics: ['Confidence Score', 'Eksekusi BUY/SELL', 'Auto SL/TP', 'Kombinasi multi-sinyal'],
    level: 'Semua Level',
    duration: '30 menit',
    students: '3.1K',
  },
];

const COLOR_MAP: Record<string, { text: string; bg: string; border: string; badge: string }> = {
  cyan: { text: 'text-[#00D4FF]', bg: 'bg-[#00D4FF]/10', border: 'border-[#00D4FF]/20', badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30' },
  purple: { text: 'text-[#7B2FFF]', bg: 'bg-[#7B2FFF]/10', border: 'border-[#7B2FFF]/20', badge: 'bg-[#7B2FFF]/10 text-[#7B2FFF] border-[#7B2FFF]/30' },
  green: { text: 'text-[#00E676]', bg: 'bg-[#00E676]/10', border: 'border-[#00E676]/20', badge: 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30' },
  gold: { text: 'text-[#FFD700]', bg: 'bg-[#FFD700]/10', border: 'border-[#FFD700]/20', badge: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30' },
  red: { text: 'text-[#FF4757]', bg: 'bg-[#FF4757]/10', border: 'border-[#FF4757]/20', badge: 'bg-[#FF4757]/10 text-[#FF4757] border-[#FF4757]/30' },
};

const LEVEL_COLOR: Record<string, string> = {
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

          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 text-[#7B2FFF] text-xs font-semibold mb-4">
              <BookOpen size={12} /> Pusat Edukasi Trading
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Belajar Trading<br />
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">dari Nol hingga Mahir</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#8BA8C2] text-lg">
              Materi edukasi trading lengkap dan gratis untuk semua pengguna TradeSignal Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES.map((m) => {
              const Icon = m.icon;
              const c = COLOR_MAP[m.color];
              return (
                <Link key={m.slug} href={`/edukasi/${m.slug}`}
                  className="group p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-card flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon size={20} className={c.text} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${LEVEL_COLOR[m.level]}`}>
                      {m.level}
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-base mb-2 group-hover:text-[#00D4FF] transition-colors">{m.title}</h3>
                  <p className="text-[#8BA8C2] text-xs leading-relaxed mb-4 flex-1">{m.desc}</p>

                  <ul className="space-y-1.5 mb-5">
                    {m.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2 text-xs text-[#8BA8C2]">
                        <ChevronRight size={10} className={c.text} />
                        {t}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[#4A6080] text-[10px]">
                      <span className="flex items-center gap-1"><Clock size={9} /> {m.duration}</span>
                      <span className="flex items-center gap-1"><Users size={9} /> {m.students}</span>
                    </div>
                    <span className={`text-xs font-bold ${c.text} group-hover:translate-x-1 transition-transform inline-block`}>
                      Mulai →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-16 p-8 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <h2 className="text-white font-bold text-xl mb-2">Siap Terapkan Ilmunya?</h2>
            <p className="text-[#8BA8C2] text-sm mb-6">Gunakan sinyal real-time TradeSignal Pro untuk praktik langsung</p>
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
