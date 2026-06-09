'use client';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    role: 'Trader Retail, Surabaya',
    avatar: 'BS',
    plan: 'Premium IDN',
    rating: 5,
    text: 'Sinyal BBCA yang muncul jam 9 pagi akurat banget. Langsung naik 2.5% dalam satu hari. Confidence score 85+ emang jarang meleset.',
    color: 'cyan',
  },
  {
    name: 'Dewi Rahayu',
    role: 'Investor Pemula, Jakarta',
    avatar: 'DR',
    plan: 'VIP All-Access',
    rating: 5,
    text: 'Sebagai pemula yang baru belajar trading, fitur Auto SL/TP sangat membantu. Tidak perlu takut kehilangan banyak karena risk management sudah diatur otomatis.',
    color: 'purple',
  },
  {
    name: 'Ahmad Fauzi',
    role: 'Crypto Trader, Bandung',
    avatar: 'AF',
    plan: 'Premium Crypto',
    rating: 5,
    text: 'BTC signal yang muncul sebelum rally kemarin epic banget. Confidence 92%, naik 4% dalam 6 jam. TradeSignal Pro jadi andalan utama saya.',
    color: 'gold',
  },
  {
    name: 'Rina Wulandari',
    role: 'Swing Trader, Medan',
    avatar: 'RW',
    plan: 'Premium IDN',
    rating: 4,
    text: 'Screener-nya sangat membantu buat cari saham IDN yang lagi dalam kondisi teknikal bagus. Filter RSI oversold langsung kasih kandidat yang solid.',
    color: 'green',
  },
  {
    name: 'Hendro Kusuma',
    role: 'Full-time Trader, Bali',
    avatar: 'HK',
    plan: 'VIP All-Access',
    rating: 5,
    text: 'Pakai VIP sudah 3 bulan. Win rate sinyal saya naik signifikan karena hanya masuk di confidence 80+. ROI bulanan konsisten di atas 15%.',
    color: 'cyan',
  },
  {
    name: 'Sari Indah',
    role: 'Karyawan & Investor, Yogyakarta',
    avatar: 'SI',
    plan: 'Premium IDN',
    rating: 5,
    text: 'Notifikasi push notification-nya keren banget. Tidak perlu monitor terus, cukup tunggu notif masuk, lalu eksekusi. Cocok buat yang kerja sambil trading.',
    color: 'purple',
  },
];

const colorMap: Record<string, string> = {
  cyan: 'from-[#00D4FF]/20 to-transparent border-[#00D4FF]/20',
  purple: 'from-[#7B2FFF]/20 to-transparent border-[#7B2FFF]/20',
  gold: 'from-[#FFD700]/20 to-transparent border-[#FFD700]/20',
  green: 'from-[#00E676]/20 to-transparent border-[#00E676]/20',
};

const avatarColor: Record<string, string> = {
  cyan: 'bg-[#00D4FF]/20 text-[#00D4FF] border-[#00D4FF]/30',
  purple: 'bg-[#7B2FFF]/20 text-[#7B2FFF] border-[#7B2FFF]/30',
  gold: 'bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30',
  green: 'bg-[#00E676]/20 text-[#00E676] border-[#00E676]/30',
};

export function TestimonialsSection() {
  return (
    <section className="relative py-24 bg-[#060B18] overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-semibold mb-4">
            <Star size={12} fill="currentColor" /> Testimoni Pengguna
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Dipercaya oleh<br />
            <span className="bg-gradient-to-r from-[#FFD700] to-[#00D4FF] bg-clip-text text-transparent">3.200+ Trader Indonesia</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`relative p-6 rounded-2xl glass border bg-gradient-to-br ${colorMap[t.color]} transition-all duration-300 hover:scale-[1.02] hover:shadow-card`}
            >
              <Quote size={20} className="absolute top-4 right-4 text-white/10" />

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full border font-bold text-sm flex items-center justify-center font-mono ${avatarColor[t.color]}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{t.name}</p>
                  <p className="text-[#8BA8C2] text-xs">{t.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={12} className="text-[#FFD700]" fill="#FFD700" />
                ))}
                <span className="ml-2 text-[10px] font-mono text-[#4A6080] bg-white/5 px-2 py-0.5 rounded-full">{t.plan}</span>
              </div>

              <p className="text-[#8BA8C2] text-sm leading-relaxed">"{t.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
