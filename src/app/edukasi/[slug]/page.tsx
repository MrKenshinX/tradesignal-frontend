import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, BookOpen, Zap } from 'lucide-react';

const MODULES: Record<string, {
  title: string; level: string; duration: string;
  intro: string; sections: { title: string; content: string }[];
}> = {
  'dasar-trading': {
    title: 'Dasar Trading untuk Pemula',
    level: 'Pemula', duration: '45 menit',
    intro: 'Trading adalah aktivitas jual-beli instrumen keuangan seperti saham, forex, atau cryptocurrency dengan tujuan mendapatkan keuntungan dari pergerakan harga.',
    sections: [
      { title: 'Apa itu Trading?', content: 'Trading berbeda dengan investasi jangka panjang. Trader memanfaatkan pergerakan harga jangka pendek hingga menengah untuk mendapatkan profit. Ada berbagai jenis trading: day trading (dalam sehari), swing trading (beberapa hari-minggu), dan position trading (mingguan-bulanan).' },
      { title: 'Membaca Candlestick', content: 'Candlestick adalah representasi visual pergerakan harga dalam satu periode. Setiap candle menunjukkan harga pembukaan (open), tertinggi (high), terendah (low), dan penutupan (close). Candle hijau/putih berarti harga naik, candle merah/hitam berarti harga turun. Pola candlestick seperti Doji, Hammer, dan Engulfing memberikan sinyal potensial pembalikan arah.' },
      { title: 'Support dan Resistance', content: 'Support adalah level harga di mana permintaan cukup kuat untuk mencegah harga turun lebih jauh. Resistance adalah kebalikannya — level di mana penawaran cukup kuat untuk mencegah harga naik lebih jauh. Breakout dari level-level ini sering menghasilkan pergerakan harga yang signifikan.' },
      { title: 'Timeframe Trading', content: 'Timeframe adalah periode waktu yang digunakan untuk menganalisis chart. M1 (1 menit) untuk scalping, M15/H1 untuk day trading, H4/D1 untuk swing trading, W1 untuk position trading. Semakin panjang timeframe, semakin reliable sinyalnya namun semakin jarang peluangnya.' },
    ],
  },
  'analisis-teknikal': {
    title: 'Analisis Teknikal',
    level: 'Menengah', duration: '1.5 jam',
    intro: 'Analisis teknikal adalah metode evaluasi aset keuangan berdasarkan statistik aktivitas pasar historis, terutama harga dan volume.',
    sections: [
      { title: 'RSI (Relative Strength Index)', content: 'RSI adalah indikator momentum yang mengukur kecepatan dan perubahan pergerakan harga, dengan skala 0-100. RSI di atas 70 menandakan kondisi overbought (kemungkinan turun), RSI di bawah 30 menandakan oversold (kemungkinan naik). TradeSignal Pro menggunakan RSI periode 14 sebagai standar industri.' },
      { title: 'MACD (Moving Average Convergence Divergence)', content: 'MACD terdiri dari MACD line (EMA 12 - EMA 26), Signal line (EMA 9 dari MACD), dan Histogram. Ketika MACD line memotong Signal line ke atas = sinyal BUY. Ketika memotong ke bawah = sinyal SELL. MACD Divergence dengan harga sering menjadi tanda pembalikan tren yang kuat.' },
      { title: 'Bollinger Bands', content: 'Bollinger Bands terdiri dari tiga garis: Middle Band (SMA 20), Upper Band (+2 standar deviasi), dan Lower Band (-2 standar deviasi). Ketika harga menyentuh Lower Band → potensial BUY. Ketika menyentuh Upper Band → potensial SELL. Bollinger Squeeze (band menyempit) sering mendahului pergerakan besar.' },
      { title: 'EMA (Exponential Moving Average)', content: 'EMA memberikan bobot lebih besar pada harga terkini dibanding SMA biasa. EMA 20 untuk tren jangka pendek, EMA 50 untuk menengah, EMA 200 untuk tren jangka panjang. Golden Cross (EMA 50 memotong EMA 200 ke atas) adalah sinyal bullish kuat. Death Cross adalah kebalikannya.' },
    ],
  },
  'manajemen-risiko': {
    title: 'Manajemen Risiko',
    level: 'Menengah', duration: '1 jam',
    intro: 'Manajemen risiko adalah aspek terpenting dalam trading. Trader yang sukses bukan yang paling sering profit, tapi yang paling baik mengelola kerugian.',
    sections: [
      { title: 'Pentingnya Stop Loss', content: 'Stop Loss adalah perintah otomatis untuk menutup posisi saat harga mencapai level tertentu, membatasi kerugian maksimal. SELALU gunakan Stop Loss. Trader yang tidak menggunakan SL cepat atau lambat akan mengalami kerugian besar. Rule of thumb: jangan pernah risk lebih dari 1-2% modal per trade.' },
      { title: 'Risk/Reward Ratio', content: 'Risk/Reward Ratio membandingkan potensi kerugian dengan potensi keuntungan. Minimal gunakan R/R 1:2 (risk 1%, target profit 2%). Dengan R/R 1:2, kamu tetap profit meski win rate hanya 40%. Formula: (Take Profit - Entry) / (Entry - Stop Loss) = R/R Ratio.' },
      { title: 'ATR untuk Stop Loss', content: 'ATR (Average True Range) mengukur volatilitas pasar. TradeSignal Pro menggunakan ATR untuk menghitung SL/TP secara otomatis. Stop Loss biasanya ditempatkan 1-2x ATR dari entry price. Ini memastikan SL tidak terlalu dekat (kena noise) atau terlalu jauh (kerugian terlalu besar).' },
      { title: 'Position Sizing', content: 'Position sizing menentukan berapa banyak lot/unit yang dibeli. Rumus: Position Size = (Modal × Risk %) / (Entry Price - Stop Loss Price). Contoh: Modal Rp10jt, risk 1% = Rp100K. SL jarak 5% = beli Rp2jt. Jangan pernah all-in dalam satu posisi.' },
    ],
  },
  'swing-trading': {
    title: 'Strategi Swing Trading',
    level: 'Menengah', duration: '1.5 jam',
    intro: 'Swing trading adalah strategi yang memanfaatkan pergerakan harga ("swing") dalam tren jangka menengah, biasanya berlangsung beberapa hari hingga beberapa minggu.',
    sections: [
      { title: 'Karakteristik Swing Trading', content: 'Swing trading cocok untuk mereka yang bekerja dan tidak bisa monitor market seharian. Analisis biasanya dilakukan di H4 atau D1. Entry dan exit tidak harus presisi ke detik. Dengan sinyal TradeSignal Pro, kamu bisa swing trade hanya 30 menit per hari.' },
      { title: 'Mencari Setup Swing Trading', content: 'Cari saham dalam tren jelas (uptrend atau downtrend). Di uptrend, beli saat koreksi ke support/EMA. Di downtrend, jual/short saat rally ke resistance/EMA. Konfirmasi dengan volume — koreksi seharusnya terjadi dengan volume rendah, kelanjutan tren dengan volume tinggi.' },
      { title: 'Entry dan Exit Point', content: 'Entry terbaik adalah saat reversal di support (untuk long) atau resistance (untuk short). Gunakan candlestick confirmation: Pin Bar, Engulfing, atau Morning Star. Exit saat mencapai resistance berikutnya atau Target Profit. Jangan serakah — ambil profit secara bertahap.' },
      { title: 'Menggunakan Sinyal TradeSignal Pro', content: 'Filter sinyal TradeSignal Pro dengan Confidence Score minimal 75+ untuk swing trading. Gunakan timeframe H4/D1 untuk konfirmasi. Cek RSI tidak overbought untuk BUY (idealnya 30-50) dan tidak oversold untuk SELL (idealnya 50-70). Jalankan sinyal dan set SL/TP sesuai rekomendasi.' },
    ],
  },
  'trading-crypto': {
    title: 'Trading Cryptocurrency',
    level: 'Menengah', duration: '2 jam',
    intro: 'Cryptocurrency adalah aset digital yang menggunakan kriptografi untuk keamanan. Trading crypto menawarkan peluang besar namun juga risiko tinggi karena volatilitasnya.',
    sections: [
      { title: 'Perbedaan Crypto vs Saham', content: 'Crypto trading 24/7 tanpa hari libur. Volatilitas jauh lebih tinggi — bisa naik/turun 10-20% dalam sehari. Tidak ada circuit breaker. Likuiditas bervariasi antar koin. Keuntungan: peluang profit lebih besar. Kerugian: risiko lebih tinggi, perlu manajemen risiko ekstra ketat.' },
      { title: 'Bitcoin dan Altcoin', content: 'Bitcoin (BTC) adalah raja crypto — pergerakannya mempengaruhi seluruh pasar. Saat BTC naik, altcoin biasanya ikut naik lebih tinggi (altcoin season). Saat BTC turun, altcoin biasanya turun lebih dalam. Fokus pada top 10-20 crypto berdasarkan market cap untuk likuiditas terbaik.' },
      { title: 'Strategi DCA vs Trading Aktif', content: 'DCA (Dollar Cost Averaging): beli sejumlah fixed secara berkala tanpa peduli harga. Cocok untuk jangka panjang dengan risiko lebih rendah. Trading Aktif: manfaatkan volatilitas untuk profit jangka pendek. Membutuhkan skill analisis teknikal dan disiplin ketat. TradeSignal Pro membantu keduanya.' },
      { title: 'Keamanan Aset Crypto', content: 'Selalu gunakan exchange terpercaya dan ber-regulasi. Aktifkan 2FA di semua akun. Jangan simpan semua crypto di exchange — gunakan hardware wallet untuk jumlah besar. Jangan pernah share seed phrase atau private key. Waspada penipuan (scam) yang marak di dunia crypto.' },
    ],
  },
  'membaca-sinyal': {
    title: 'Membaca Sinyal TradeSignal Pro',
    level: 'Semua Level', duration: '30 menit',
    intro: 'Panduan lengkap cara memaksimalkan penggunaan sinyal trading dari platform TradeSignal Pro.',
    sections: [
      { title: 'Memahami Confidence Score', content: 'Confidence Score (0-100) mencerminkan kekuatan sinyal berdasarkan konvergensi multi-indikator. Score 80+ = sinyal sangat kuat (prioritas eksekusi). Score 60-79 = cukup kuat (pertimbangkan entry). Score di bawah 60 = sinyal lemah (tunggu konfirmasi). Gunakan filter Confidence Score 75+ untuk hasil terbaik.' },
      { title: 'Eksekusi Sinyal BUY/SELL', content: 'Saat sinyal BUY muncul: buka posisi long di harga Entry Price atau sedikit di atasnya. Set Stop Loss sesuai rekomendasi. Set Take Profit sesuai rekomendasi. Monitor posisi — jangan move SL lebih dekat ke entry. Saat sinyal SELL: kebalikannya, atau close posisi long yang sudah ada.' },
      { title: 'Auto Stop Loss & Take Profit', content: 'TradeSignal Pro menghitung SL/TP berbasis ATR secara otomatis. SL ditempatkan di level yang logis secara teknikal, bukan sembarangan. TP dihitung berdasarkan R/R minimal 1:2. Kamu bisa menyesuaikan SL/TP sesuai toleransi risiko pribadi, tapi jangan terlalu jauh dari rekomendasi.' },
      { title: 'Kombinasi Multi-Sinyal', content: 'Sinyal terkuat adalah ketika ada confluence — beberapa sinyal dari instrumen berbeda menunjukkan arah yang sama. Contoh: BTC BUY + ETH BUY + BNB BUY = bullish crypto market. BBCA BUY + BBRI BUY + BMRI BUY = bullish sektor perbankan. Gunakan ini untuk menambah conviction sebelum entry.' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(MODULES).map(slug => ({ slug }));
}

const LEVEL_COLOR: Record<string, string> = {
  'Pemula': 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30',
  'Menengah': 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30',
  'Semua Level': 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
};

export default function EdukasiModulePage({ params }: { params: { slug: string } }) {
  const module = MODULES[params.slug];

  if (!module) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#060B18] pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Modul tidak ditemukan</h1>
            <Link href="/edukasi" className="text-[#00D4FF] hover:underline">← Kembali ke Edukasi</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/edukasi" className="inline-flex items-center gap-2 text-[#8BA8C2] hover:text-[#00D4FF] text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Edukasi
          </Link>

          <div className="mb-2 flex items-center gap-3">
            <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${LEVEL_COLOR[module.level]}`}>
              {module.level}
            </span>
            <span className="flex items-center gap-1 text-[#4A6080] text-xs">
              <Clock size={11} /> {module.duration}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">{module.title}</h1>
          <p className="text-[#8BA8C2] leading-relaxed mb-8 pb-8 border-b border-white/5">{module.intro}</p>

          <div className="space-y-6">
            {module.sections.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/15 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#00D4FF]/15 border border-[#00D4FF]/25 flex items-center justify-center shrink-0">
                    <CheckCircle size={14} className="text-[#00D4FF]" />
                  </div>
                  <h2 className="text-white font-bold text-base">{s.title}</h2>
                </div>
                <p className="text-[#8BA8C2] leading-relaxed text-sm pl-10">{s.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <BookOpen size={28} className="text-[#00D4FF] mx-auto mb-3" />
            <h3 className="text-white font-bold text-lg mb-2">Terapkan dengan Sinyal Real</h3>
            <p className="text-[#8BA8C2] text-sm mb-5">Gunakan ilmu yang baru kamu pelajari dengan sinyal trading otomatis</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/edukasi" className="px-6 py-2.5 rounded-xl border border-white/15 text-[#8BA8C2] text-sm font-medium hover:border-[#00D4FF]/30 hover:text-white transition-all">
                ← Modul Lain
              </Link>
              <Link href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
                <Zap size={14} fill="white" /> Mulai Trading Gratis
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
