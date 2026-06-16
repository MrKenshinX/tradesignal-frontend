import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { BookOpen, Clock, TrendingUp } from 'lucide-react';

export const metadata = { title: 'Blog — Tips & Strategi Trading' };

const ARTICLES = [
  {
    slug: 'cara-membaca-sinyal-trading',
    title: 'Cara Membaca Sinyal Trading dengan Benar',
    excerpt: 'Panduan lengkap memahami sinyal BUY, SELL, dan HOLD beserta confidence score untuk memaksimalkan profit trading kamu.',
    category: 'Tutorial',
    readTime: '8 menit',
    date: '10 Jun 2025',
    color: 'cyan',
  },
  {
    slug: 'indikator-rsi-untuk-pemula',
    title: 'Memahami RSI untuk Trader Pemula',
    excerpt: 'RSI (Relative Strength Index) adalah salah satu indikator paling populer. Pelajari cara menggunakannya untuk menemukan peluang trading.',
    category: 'Edukasi',
    readTime: '6 menit',
    date: '8 Jun 2025',
    color: 'purple',
  },
  {
    slug: 'macd-trading-signal',
    title: 'MACD: Indikator Momentum Terbaik untuk Trading',
    excerpt: 'MACD membantu mengidentifikasi perubahan tren dan momentum. Pelajari cara membaca sinyal MACD dan menggunakannya dalam strategi trading.',
    category: 'Edukasi',
    readTime: '7 menit',
    date: '6 Jun 2025',
    color: 'green',
  },
  {
    slug: 'stop-loss-take-profit-optimal',
    title: 'Cara Menentukan Stop Loss & Take Profit yang Optimal',
    excerpt: 'Stop Loss dan Take Profit adalah kunci manajemen risiko. Pelajari cara menghitung level optimal menggunakan ATR.',
    category: 'Manajemen Risiko',
    readTime: '9 menit',
    date: '4 Jun 2025',
    color: 'gold',
  },
  {
    slug: 'saham-bluechip-indonesia',
    title: '10 Saham Blue Chip Indonesia Terbaik 2025',
    excerpt: 'Daftar saham blue chip Indonesia dengan fundamental kuat yang cocok untuk investasi jangka panjang maupun trading.',
    category: 'Analisis',
    readTime: '10 menit',
    date: '2 Jun 2025',
    color: 'cyan',
  },
  {
    slug: 'strategi-swing-trading',
    title: 'Strategi Swing Trading untuk Karyawan Sibuk',
    excerpt: 'Tidak punya waktu monitor market seharian? Swing trading adalah solusi — cukup 30 menit sehari untuk profit konsisten.',
    category: 'Strategi',
    readTime: '8 menit',
    date: '31 Mei 2025',
    color: 'purple',
  },
  {
    slug: 'strategi-crypto-trading',
    title: 'Strategi Trading Crypto yang Terbukti Profitable',
    excerpt: 'Crypto market bergerak cepat dan volatile. Pelajari strategi yang tepat untuk mengambil keuntungan dari volatilitas crypto.',
    category: 'Crypto',
    readTime: '11 menit',
    date: '29 Mei 2025',
    color: 'gold',
  },
  {
    slug: 'dividen-saham-idx-terbaik',
    title: 'Saham Dividen Terbaik di IDX untuk Passive Income',
    excerpt: 'Investasi saham dividen adalah cara terbaik untuk mendapatkan passive income. Ini daftar saham dengan yield dividen tertinggi di BEI.',
    category: 'Investasi',
    readTime: '7 menit',
    date: '27 Mei 2025',
    color: 'green',
  },
  {
    slug: 'panduan-trading-pemula',
    title: 'Panduan Lengkap Memulai Trading untuk Pemula',
    excerpt: 'Baru mau mulai trading? Artikel ini membahas semua yang perlu kamu ketahui — dari membuka akun hingga eksekusi order pertama.',
    category: 'Tutorial',
    readTime: '15 menit',
    date: '25 Mei 2025',
    color: 'cyan',
  },
  {
    slug: 'cara-membaca-candlestick',
    title: 'Cara Membaca Candlestick: Panduan Lengkap untuk Pemula',
    excerpt: 'Setiap lilin menceritakan pertempuran pembeli vs penjual. Pelajari anatomi candlestick, pola penting, dan cara membacanya dengan benar.',
    category: 'Edukasi',
    readTime: '11 menit',
    date: '16 Jun 2025',
    color: 'purple',
  },
  {
    slug: 'bollinger-bands-strategi',
    title: 'Bollinger Bands: Cara Membaca dan Strategi Trading',
    excerpt: 'Indikator volatilitas populer untuk mengukur harga mahal/murah dan menangkap ledakan pergerakan. Pelajari squeeze, bounce, dan konfluensi.',
    category: 'Edukasi',
    readTime: '10 menit',
    date: '15 Jun 2025',
    color: 'cyan',
  },
  {
    slug: 'cara-main-saham-modal-kecil',
    title: 'Cara Main Saham untuk Pemula dengan Modal Kecil',
    excerpt: 'Tidak perlu modal besar — mulai dari Rp 100.000. Panduan langkah demi langkah memulai saham di Indonesia secara aman dan realistis.',
    category: 'Tutorial',
    readTime: '12 menit',
    date: '14 Jun 2025',
    color: 'green',
  },
  {
    slug: 'bitcoin-crypto-untuk-pemula',
    title: 'Bitcoin dan Crypto untuk Pemula: Memahami Aset Digital',
    excerpt: 'Dasar-dasar Bitcoin, blockchain, dan crypto secara objektif — termasuk risiko dan cara mulai dengan aman. Bukan janji cepat kaya.',
    category: 'Edukasi',
    readTime: '11 menit',
    date: '13 Jun 2025',
    color: 'purple',
  },
  {
    slug: 'manajemen-modal-trading',
    title: 'Manajemen Modal Trading: Kunci Bertahan & Konsisten Profit',
    excerpt: 'Yang membedakan trader sukses dari yang bangkrut bukan strategi, tapi manajemen modal. Pelajari aturan 1-2%, position sizing, dan R/R.',
    category: 'Manajemen Risiko',
    readTime: '10 menit',
    date: '12 Jun 2025',
    color: 'cyan',
  },
];

const COLOR_MAP: Record<string, { badge: string; dot: string }> = {
  cyan: { badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/20', dot: 'bg-[#00D4FF]' },
  purple: { badge: 'bg-[#7B2FFF]/10 text-[#7B2FFF] border-[#7B2FFF]/20', dot: 'bg-[#7B2FFF]' },
  green: { badge: 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/20', dot: 'bg-[#00E676]' },
  gold: { badge: 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/20', dot: 'bg-[#FFD700]' },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-4">
              <BookOpen size={12} /> Blog & Artikel
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Tips & Strategi<br />
              <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">Trading Terkini</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[#8BA8C2] text-lg">
              Artikel edukasi trading, analisis pasar, dan tips praktis dari tim TradeSignal Pro.
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article) => {
              const c = COLOR_MAP[article.color];
              return (
                <Link key={article.slug} href={`/blog/${article.slug}`}
                  className="group p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-card flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${c.badge}`}>
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-[#4A6080] text-[10px]">
                      <Clock size={10} />
                      {article.readTime}
                    </div>
                  </div>
                  <h2 className="text-white font-bold text-base mb-2 group-hover:text-[#00D4FF] transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-[#8BA8C2] text-xs leading-relaxed flex-1 line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[#4A6080] text-[10px] font-mono">{article.date}</span>
                    <span className="text-[#00D4FF] text-xs font-semibold group-hover:translate-x-1 transition-transform inline-block">
                      Baca →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
