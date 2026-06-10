import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

const ARTICLES: Record<string, { title: string; category: string; date: string; readTime: string; content: string }> = {
  'cara-membaca-sinyal-trading': {
    title: 'Cara Membaca Sinyal Trading dengan Benar',
    category: 'Tutorial', date: '10 Jun 2025', readTime: '8 menit',
    content: `Sinyal trading adalah rekomendasi untuk membeli (BUY), menjual (SELL), atau menahan (HOLD) suatu instrumen berdasarkan analisis teknikal.

## Memahami Jenis Sinyal

**BUY (Beli)** — Sinyal ini muncul ketika indikator teknikal menunjukkan momentum bullish. Misalnya RSI yang baru keluar dari zona oversold (di bawah 30), MACD yang baru crossover ke atas, atau harga yang baru breakout dari resistance.

**SELL (Jual)** — Kebalikan dari BUY. Muncul ketika RSI masuk zona overbought (di atas 70), MACD crossover ke bawah, atau harga menyentuh resistance kuat.

**HOLD (Tahan)** — Kondisi sideways atau tidak ada sinyal yang cukup kuat. Lebih baik menunggu konfirmasi lebih lanjut.

## Confidence Score

Confidence Score (0-100) mencerminkan kekuatan sinyal berdasarkan konvergensi multi-indikator. Semakin banyak indikator yang sepakat, semakin tinggi score-nya.

- **80-100**: Sinyal sangat kuat, prioritas eksekusi
- **60-79**: Sinyal cukup kuat, pertimbangkan entry
- **40-59**: Sinyal lemah, hati-hati atau tunggu konfirmasi

## Entry, Stop Loss, dan Take Profit

Setiap sinyal dilengkapi dengan:
- **Entry Price**: Harga yang disarankan untuk masuk posisi
- **Stop Loss**: Harga batas kerugian maksimal (dihitung via ATR)
- **Take Profit**: Target keuntungan

Selalu gunakan Stop Loss untuk melindungi modal kamu!`,
  },
  'indikator-rsi-untuk-pemula': {
    title: 'Memahami RSI untuk Trader Pemula',
    category: 'Edukasi', date: '8 Jun 2025', readTime: '6 menit',
    content: `RSI (Relative Strength Index) adalah indikator momentum yang mengukur kecepatan dan perubahan pergerakan harga, dengan nilai antara 0 hingga 100.

## Cara Membaca RSI

**RSI di atas 70 — Overbought**
Harga sudah naik terlalu tinggi dan mungkin akan koreksi. Ini sinyal potensial untuk SELL atau hindari beli.

**RSI di bawah 30 — Oversold**
Harga sudah turun terlalu jauh dan mungkin akan rebound. Ini sinyal potensial untuk BUY.

**RSI 30-70 — Zona Normal**
Tidak ada sinyal ekstrem. Perhatikan arah tren dan indikator lain.

## RSI Divergence

Divergence terjadi ketika harga bergerak berlawanan dengan RSI:
- **Bullish Divergence**: Harga turun tapi RSI naik → potensi reversal ke atas
- **Bearish Divergence**: Harga naik tapi RSI turun → potensi reversal ke bawah

## RSI di TradeSignal Pro

Kami menggunakan RSI periode 14 (standar industri). Nilai RSI ditampilkan di setiap kartu sinyal untuk membantu kamu memvalidasi keputusan trading.`,
  },
};

// Generate static params for known slugs
export function generateStaticParams() {
  return Object.keys(ARTICLES).map(slug => ({ slug }));
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#060B18] pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Artikel tidak ditemukan</h1>
            <Link href="/blog" className="text-[#00D4FF] hover:underline">← Kembali ke Blog</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const paragraphs = article.content.split('\n\n');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#8BA8C2] hover:text-[#00D4FF] text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Blog
          </Link>

          <div className="mb-6">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
              {article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 text-[#4A6080] text-xs mb-8 pb-8 border-b border-white/5">
            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
            <span className="flex items-center gap-1"><BookOpen size={11} /> {article.date}</span>
          </div>

          <div className="prose prose-invert max-w-none">
            {paragraphs.map((p, i) => {
              if (p.startsWith('## ')) {
                return <h2 key={i} className="text-white font-bold text-xl mt-8 mb-3">{p.replace('## ', '')}</h2>;
              }
              if (p.startsWith('**') && p.endsWith('**')) {
                return <p key={i} className="text-white font-semibold mb-2">{p.replace(/\*\*/g, '')}</p>;
              }
              return <p key={i} className="text-[#8BA8C2] leading-relaxed mb-4 text-sm">{p}</p>;
            })}
          </div>

          <div className="mt-12 p-6 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Terapkan Ilmu Ini dengan Sinyal Real</h3>
            <p className="text-[#8BA8C2] text-sm mb-4">Dapatkan sinyal trading otomatis berbasis indikator teknikal</p>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
              Mulai Gratis →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
