import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Clock, BookOpen, Zap } from 'lucide-react';

const ARTICLES: Record<string, { title: string; category: string; date: string; readTime: string; intro: string; sections: { h: string; p: string }[] }> = {
  'cara-membaca-sinyal-trading': {
    title: 'Cara Membaca Sinyal Trading dengan Benar',
    category: 'Tutorial', date: '10 Jun 2025', readTime: '8 menit',
    intro: 'Sinyal trading adalah rekomendasi untuk membeli, menjual, atau menahan suatu instrumen berdasarkan analisis teknikal multi-indikator.',
    sections: [
      { h: 'Jenis-Jenis Sinyal', p: 'BUY muncul ketika RSI oversold, MACD crossover ke atas, dan harga breakout resistance. SELL ketika kondisi sebaliknya. HOLD ketika pasar sideways atau sinyal tidak cukup kuat. Strong Buy/Sell menandakan sinyal yang sangat kuat dengan konvergensi indikator tinggi.' },
      { h: 'Confidence Score', p: 'Score 0-100 mencerminkan kekuatan sinyal. 80+ sangat kuat, 60-79 cukup kuat, di bawah 60 lemah. Disarankan hanya masuk di score 75+ untuk swing trading dan 80+ untuk trading dengan modal besar.' },
      { h: 'Entry, Stop Loss, Take Profit', p: 'Entry Price adalah harga masuk yang disarankan. Stop Loss dihitung 1-2x ATR di bawah/atas entry untuk melindungi modal. Take Profit dihitung berdasarkan R/R minimal 1:2. Selalu eksekusi ketiga level ini sekaligus saat membuka posisi.' },
      { h: 'Timeframe Sinyal', p: 'TradeSignal Pro memberikan sinyal multi-timeframe. H4 untuk swing trading 2-7 hari. D1 untuk posisi 1-4 minggu. Pilih timeframe sesuai gaya trading dan waktu yang tersedia untuk monitor.' },
    ],
  },
  'indikator-rsi-untuk-pemula': {
    title: 'Memahami RSI untuk Trader Pemula',
    category: 'Edukasi', date: '8 Jun 2025', readTime: '6 menit',
    intro: 'RSI (Relative Strength Index) adalah indikator momentum paling populer yang mengukur kecepatan pergerakan harga dalam skala 0-100.',
    sections: [
      { h: 'Membaca Nilai RSI', p: 'RSI di atas 70 = overbought, harga kemungkinan akan turun. RSI di bawah 30 = oversold, harga kemungkinan akan naik. RSI 40-60 = zona netral. Namun di tren kuat, RSI bisa tetap di atas 70 atau di bawah 30 dalam waktu lama.' },
      { h: 'RSI Divergence', p: 'Bullish Divergence: harga turun membuat low baru tapi RSI tidak → sinyal reversal naik. Bearish Divergence: harga naik membuat high baru tapi RSI tidak → sinyal reversal turun. Ini salah satu sinyal paling reliable.' },
      { h: 'RSI di TradeSignal Pro', p: 'Kami menggunakan RSI 14 periode. Nilai RSI ditampilkan di setiap kartu sinyal. Untuk BUY terbaik, cari RSI 30-50 (baru keluar dari oversold). Untuk SELL terbaik, cari RSI 50-70 (baru keluar dari overbought).' },
    ],
  },
  'macd-trading-signal': {
    title: 'MACD: Indikator Momentum Terbaik untuk Trading',
    category: 'Edukasi', date: '6 Jun 2025', readTime: '7 menit',
    intro: 'MACD (Moving Average Convergence Divergence) adalah indikator yang menunjukkan hubungan antara dua moving average harga.',
    sections: [
      { h: 'Komponen MACD', p: 'MACD Line = EMA(12) - EMA(26). Signal Line = EMA(9) dari MACD. Histogram = MACD - Signal Line. Histogram hijau naik = momentum bullish meningkat. Histogram merah turun = momentum bearish meningkat.' },
      { h: 'Sinyal MACD', p: 'Golden Cross: MACD memotong Signal Line ke atas = sinyal BUY. Death Cross: MACD memotong Signal Line ke bawah = sinyal SELL. Semakin jauh dari zero line, semakin kuat momentum. Crossover di bawah zero line menghasilkan sinyal BUY lebih kuat.' },
      { h: 'MACD Divergence', p: 'Seperti RSI, MACD divergence sangat powerful. Harga naik tapi MACD turun = bearish divergence. Harga turun tapi MACD naik = bullish divergence. Kombinasikan dengan RSI divergence untuk sinyal yang sangat kuat.' },
    ],
  },
  'stop-loss-take-profit-optimal': {
    title: 'Cara Menentukan Stop Loss & Take Profit yang Optimal',
    category: 'Manajemen Risiko', date: '4 Jun 2025', readTime: '9 menit',
    intro: 'Stop Loss dan Take Profit adalah dua komponen paling kritis dalam trading. Tanpa keduanya, kamu berjudi, bukan trading.',
    sections: [
      { h: 'Mengapa Stop Loss Wajib?', p: 'Tanpa SL, satu trade yang salah bisa menghapus profit dari 10 trade yang benar. Psikologi trader sering menolak cut loss berharap harga balik — ini jebakan mental. SL menghilangkan emosi dari persamaan.' },
      { h: 'ATR sebagai Dasar Perhitungan', p: 'ATR mengukur volatilitas rata-rata dalam N periode. SL optimal = Entry ± (1.5-2 × ATR). Ini memastikan SL tidak terlalu dekat (kena noise normal) namun tidak terlalu jauh (kerugian terlalu besar). TradeSignal Pro melakukan ini otomatis.' },
      { h: 'Risk/Reward Ratio', p: 'Minimal R/R 1:2 artinya risk 100K untuk target profit 200K. Dengan win rate 50%, kamu masih profit. Dengan R/R 1:3 dan win rate 40%, kamu sudah sangat profitable. Jangan masuk trade dengan R/R di bawah 1:1.5.' },
    ],
  },
  'saham-bluechip-indonesia': {
    title: '10 Saham Blue Chip Indonesia Terbaik 2025',
    category: 'Analisis', date: '2 Jun 2025', readTime: '10 menit',
    intro: 'Saham blue chip adalah saham perusahaan besar, stabil, dan dikenal luas dengan rekam jejak kinerja yang baik secara konsisten.',
    sections: [
      { h: 'Apa itu Blue Chip?', p: 'Saham blue chip biasanya masuk indeks LQ45 atau IDX30. Kapitalisasi pasar besar, likuiditas tinggi, fundamental kuat, dan memiliki sejarah pembayaran dividen konsisten. Lebih stabil dari saham small cap namun tetap bergerak mengikuti tren pasar.' },
      { h: 'Sektor Unggulan', p: 'Perbankan: BBCA, BBRI, BMRI, BBNI — konsisten bayar dividen. Konsumer: UNVR, ICBP — defensive, tahan krisis. Energi: TLKM, ASII — infrastruktur vital. Tambang: MDKA, ANTM — diuntungkan harga komoditas tinggi.' },
      { h: 'Strategi Trading Blue Chip', p: 'Blue chip cocok untuk swing trading menggunakan sinyal TradeSignal Pro. Saat pasar koreksi dan saham blue chip turun ke support kuat, ini peluang BUY yang sangat baik. Gunakan sinyal dengan Confidence Score 80+ untuk entry yang optimal.' },
    ],
  },
  'strategi-swing-trading': {
    title: 'Strategi Swing Trading untuk Karyawan Sibuk',
    category: 'Strategi', date: '31 Mei 2025', readTime: '8 menit',
    intro: 'Swing trading memungkinkan kamu profit dari pasar tanpa harus monitor layar seharian — cukup 30-60 menit sehari.',
    sections: [
      { h: 'Kenapa Swing Trading?', p: 'Day trading membutuhkan waktu full-time dan mental baja. Swing trading lebih santai — analisis di malam hari, set order, dan biarkan bekerja. Cocok untuk karyawan, mahasiswa, atau siapapun yang punya pekerjaan utama.' },
      { h: 'Setup Harian dengan TradeSignal Pro', p: 'Pagi: cek sinyal baru dan pergerakan posisi aktif (10 menit). Siang: cek notifikasi jika ada sinyal penting (5 menit). Malam: analisis chart dan rencanakan trade untuk besok (20-30 menit). Total: kurang dari 1 jam sehari.' },
      { h: 'Manajemen Posisi', p: 'Jangan buka lebih dari 3-5 posisi sekaligus. Diversifikasi antar sektor. Jika sinyal baru datang tapi sudah 5 posisi terbuka, pilih yang Confidence Score-nya lebih tinggi. Partial exit di 50% TP untuk lock profit sambil biarkan sisa berjalan.' },
    ],
  },
  'strategi-crypto-trading': {
    title: 'Strategi Trading Crypto yang Terbukti Profitable',
    category: 'Crypto', date: '29 Mei 2025', readTime: '11 menit',
    intro: 'Crypto market menawarkan peluang profit luar biasa dengan volatilitas tinggi. Strategi yang tepat bisa mengubah volatilitas menjadi keuntungan.',
    sections: [
      { h: 'Pilih Exchange yang Tepat', p: 'Gunakan exchange regulasi resmi seperti Pintu, Indodax (lokal) atau Binance, Bybit (internasional). Pastikan ada fitur SL/TP otomatis. Jangan taruh semua aset di satu exchange.' },
      { h: 'Bitcoin Dominance', p: 'BTC.D (Bitcoin Dominance) adalah indikator penting. BTC.D naik = BTC outperform altcoin. BTC.D turun = altcoin season. Saat altcoin season, sinyal BUY di altcoin top 20 bisa memberikan return 2-5x lebih tinggi dari BTC.' },
      { h: 'Menggunakan Sinyal Crypto TradeSignal Pro', p: 'Kami memantau top 50 crypto dengan data Binance WebSocket real-time. Untuk swing trading crypto, gunakan timeframe H4/D1. Confidence Score 80+ untuk crypto lebih direkomendasikan karena volatilitas lebih tinggi. ATR-based SL/TP sangat penting di crypto.' },
    ],
  },
  'dividen-saham-idx-terbaik': {
    title: 'Saham Dividen Terbaik di IDX untuk Passive Income',
    category: 'Investasi', date: '27 Mei 2025', readTime: '7 menit',
    intro: 'Investasi saham dividen adalah cara membangun passive income yang konsisten dari pasar modal Indonesia.',
    sections: [
      { h: 'Cara Kerja Dividen', p: 'Perusahaan membagikan sebagian laba kepada pemegang saham dalam bentuk dividen. Dividend Yield = Dividen per Saham / Harga Saham × 100%. Yield 3-5% sudah sangat baik. Perhatikan juga konsistensi pembayaran, bukan hanya yield tinggi.' },
      { h: 'Saham Dividen Terbaik IDX', p: 'BBCA: yield stabil, fundamental terkuat. BBRI: yield lebih tinggi, ekspansi digital agresif. TLKM: yield 5%+, defensive. ICBP: konsisten bayar dividen meski market turun. UNVR: dividend aristocrat Indonesia, bayar dividen lebih dari 30 tahun berturut-turut.' },
      { h: 'Strategi Dividend + Trading', p: 'Beli saham dividen saat koreksi menggunakan sinyal TradeSignal Pro. Dapatkan dividen sebagai passive income. Jika harga naik signifikan, ambil profit. Reinvestasi dividen untuk compounding effect. Strategi ini memberikan double benefit: capital gain + dividend income.' },
    ],
  },
  'panduan-trading-pemula': {
    title: 'Panduan Lengkap Memulai Trading untuk Pemula',
    category: 'Tutorial', date: '25 Mei 2025', readTime: '15 menit',
    intro: 'Memulai trading terasa menakutkan bagi pemula. Panduan ini akan memandu kamu langkah demi langkah dari nol hingga siap trading.',
    sections: [
      { h: 'Langkah 1: Edukasi Dasar', p: 'Sebelum trading dengan uang sungguhan, pelajari dasar-dasar: cara membaca chart, candlestick, support/resistance, dan indikator teknikal dasar. Manfaatkan modul edukasi gratis di TradeSignal Pro. Jangan lewati tahap ini — mayoritas trader pemula rugi karena skip edukasi.' },
      { h: 'Langkah 2: Buka Akun dan Simulasi', p: 'Buka akun di broker/exchange terpercaya. Mulai dengan paper trading (simulasi) untuk 1-2 bulan. Ikuti sinyal TradeSignal Pro di paper trading untuk memahami cara kerjanya tanpa risiko uang sungguhan.' },
      { h: 'Langkah 3: Modal Kecil Dahulu', p: 'Mulai dengan modal yang tidak mengganggu keuangan (idealnya 5-10% dari tabungan). Fokus pada konsistensi, bukan profit besar. Target realistis: 5-10% per bulan sudah sangat baik. Tambah modal secara bertahap seiring meningkatnya skill dan kepercayaan diri.' },
      { h: 'Langkah 4: Disiplin dan Psikologi', p: 'Trading sukses 20% teknikal, 80% psikologi. Patuh pada rencana trading. Jangan revenge trading setelah loss. Jangan FOMO beli di puncak. Jurnal setiap trade untuk evaluasi. Gunakan sinyal TradeSignal Pro sebagai objective guidance, bukan emosi.' },
    ],
  },
  'cara-membaca-candlestick': {
    title: 'Cara Membaca Candlestick: Panduan Lengkap untuk Pemula',
    category: 'Edukasi', date: '16 Jun 2025', readTime: '11 menit',
    intro: 'Candlestick atau grafik lilin adalah cara paling populer menampilkan pergerakan harga. Setiap lilin menceritakan pertempuran antara pembeli dan penjual dalam satu periode waktu. Memahami candlestick adalah fondasi wajib sebelum membaca pola atau indikator apa pun.',
    sections: [
      { h: 'Anatomi Satu Candlestick', p: 'Setiap candlestick punya empat data: Open (harga pembukaan), High (tertinggi), Low (terendah), dan Close (penutupan) — dikenal sebagai OHLC. Bagian tebal disebut "body" (badan), menunjukkan jarak antara open dan close. Garis tipis di atas dan bawah disebut "wick" atau "shadow" (sumbu/ekor), menunjukkan high dan low. Body hijau (atau putih) berarti close lebih tinggi dari open — pembeli menang. Body merah (atau hitam) berarti close lebih rendah dari open — penjual menang.' },
      { h: 'Membaca Psikologi Pasar dari Body dan Wick', p: 'Body panjang menunjukkan dominasi kuat satu pihak: body hijau panjang = tekanan beli kuat, body merah panjang = tekanan jual kuat. Body pendek menunjukkan keraguan atau keseimbangan. Wick panjang di atas berarti harga sempat naik tinggi tapi ditolak (penjual masuk) — sinyal kelemahan. Wick panjang di bawah berarti harga sempat turun tapi dibeli kembali (pembeli masuk) — sinyal kekuatan. Membaca rasio body terhadap wick membantu mengukur siapa yang sedang mengontrol pasar.' },
      { h: 'Pola Candlestick Tunggal Penting', p: 'Doji: body sangat tipis (open = close), menandakan keraguan dan sering muncul sebelum pembalikan arah. Hammer: body kecil di atas dengan wick bawah panjang, muncul setelah penurunan — sinyal pembalikan naik. Shooting Star: kebalikan hammer, body kecil di bawah dengan wick atas panjang setelah kenaikan — sinyal pembalikan turun. Marubozu: body penuh tanpa wick, menandakan tren sangat kuat searah body.' },
      { h: 'Pola Candlestick Ganda dan Tiga', p: 'Bullish Engulfing: lilin hijau besar "menelan" lilin merah sebelumnya — sinyal beli kuat. Bearish Engulfing: kebalikannya. Morning Star: tiga lilin (merah besar, doji/kecil, hijau besar) menandakan dasar dan pembalikan naik. Evening Star: kebalikannya di puncak. Pola-pola ini jauh lebih reliable ketika muncul di area support atau resistance penting, bukan di tengah tren.' },
      { h: 'Timeframe dan Konteks', p: 'Satu pola candlestick di timeframe 1 menit jauh kurang bermakna dibanding di timeframe harian (D1) atau 4 jam (H4). Selalu baca candlestick dalam konteks tren besar dan level kunci. Pola pembalikan di support kuat dengan timeframe besar adalah sinyal paling andal. Jangan pernah trading hanya berdasarkan satu lilin tanpa konfirmasi dari indikator lain atau struktur harga.' },
      { h: 'Candlestick dan Sinyal Otomatis', p: 'TradeSignal Pro menganalisis pola candlestick bersama RSI, MACD, dan Bollinger Bands secara otomatis. Daripada menghafal puluhan pola, sistem mengidentifikasi konfluensi (beberapa sinyal sejalan) lalu memberi rekomendasi dengan confidence score. Untuk berlatih membaca candlestick tanpa risiko, kamu juga bisa mencoba simulator grafik di fitur game kami yang menampilkan candlestick bergerak realtime.' },
    ],
  },
  'bollinger-bands-strategi': {
    title: 'Bollinger Bands: Cara Membaca dan Strategi Trading',
    category: 'Edukasi', date: '15 Jun 2025', readTime: '10 menit',
    intro: 'Bollinger Bands adalah indikator volatilitas yang membungkus harga dengan tiga garis. Indikator ini membantu trader mengukur apakah harga sedang "mahal" atau "murah" secara relatif, serta kapan volatilitas akan meledak. Dikembangkan John Bollinger pada 1980-an, indikator ini tetap salah satu yang paling banyak dipakai hingga kini.',
    sections: [
      { h: 'Tiga Komponen Bollinger Bands', p: 'Garis tengah adalah Simple Moving Average (biasanya SMA 20 periode). Garis atas adalah SMA + (2 × standar deviasi). Garis bawah adalah SMA - (2 × standar deviasi). Karena menggunakan standar deviasi, lebar pita otomatis menyesuaikan volatilitas: pita melebar saat pasar bergejolak dan menyempit saat pasar tenang. Sekitar 90% pergerakan harga terjadi di dalam pita.' },
      { h: 'Membaca Posisi Harga terhadap Pita', p: 'Harga menyentuh pita atas berarti kondisi relatif overbought — bukan otomatis sinyal jual, tapi peringatan. Harga menyentuh pita bawah berarti relatif oversold. Di pasar sideways, harga cenderung memantul antara pita atas dan bawah, memberi peluang beli di bawah dan jual di atas. Namun di tren kuat, harga bisa "berjalan" di sepanjang pita atas (uptrend kuat) atau pita bawah (downtrend kuat) — ini sering disalahartikan pemula sebagai sinyal balik.' },
      { h: 'Bollinger Squeeze: Sinyal Ledakan Volatilitas', p: 'Ketika pita menyempit drastis (squeeze), itu menandakan volatilitas sangat rendah dan pasar sedang "menahan napas". Squeeze hampir selalu diikuti pergerakan besar — tapi arahnya belum pasti. Trader menunggu harga breakout keluar dari pita yang menyempit, lalu masuk searah breakout dengan konfirmasi volume. Ini salah satu setup paling populer karena menangkap awal pergerakan besar.' },
      { h: 'Strategi Bollinger Band Bounce', p: 'Di pasar ranging (sideways), strategi bounce sederhana: beli saat harga menyentuh pita bawah dengan konfirmasi candlestick bullish (mis. hammer), target di garis tengah atau pita atas. Jual saat menyentuh pita atas dengan candlestick bearish. Selalu pasang stop loss tepat di luar pita untuk berjaga jika harga ternyata breakout, bukan memantul.' },
      { h: 'Menggabungkan dengan RSI dan MACD', p: 'Bollinger Bands paling kuat ketika dikombinasikan. Contoh setup andal: harga menyentuh pita bawah + RSI di bawah 30 (oversold) + MACD mulai membentuk bullish divergence = sinyal beli berkonfluensi tinggi. Mengandalkan satu indikator saja menghasilkan banyak sinyal palsu; konfluensi beberapa indikator menyaringnya.' },
      { h: 'Kesalahan Umum dan Penerapan Otomatis', p: 'Kesalahan terbesar: menganggap sentuhan pita atas/bawah sebagai sinyal jual/beli otomatis tanpa konteks tren. Di tren kuat, ini menghasilkan kerugian beruntun. TradeSignal Pro menghitung posisi harga terhadap Bollinger Bands bersama tren dan momentum, lalu hanya memunculkan sinyal saat konfluensi cukup kuat — menghindari jebakan sentuhan pita di tengah tren.' },
    ],
  },
  'cara-main-saham-modal-kecil': {
    title: 'Cara Main Saham untuk Pemula dengan Modal Kecil',
    category: 'Tutorial', date: '14 Jun 2025', readTime: '12 menit',
    intro: 'Banyak orang mengira butuh modal puluhan juta untuk mulai investasi saham. Faktanya, kamu bisa mulai dengan Rp 100.000. Panduan ini membahas langkah demi langkah memulai saham di Indonesia dengan modal kecil, secara aman dan realistis, tanpa janji cepat kaya.',
    sections: [
      { h: 'Memahami Apa Itu Saham', p: 'Saham adalah bukti kepemilikan sebagian kecil sebuah perusahaan. Saat kamu membeli saham BBCA, kamu menjadi pemilik sebagian kecil Bank BCA. Keuntungan datang dari dua sumber: capital gain (harga naik lalu dijual) dan dividen (bagi hasil keuntungan perusahaan). Saham diperdagangkan dalam satuan "lot", di mana 1 lot = 100 lembar. Jadi jika harga saham Rp 1.000, 1 lot hanya butuh Rp 100.000.' },
      { h: 'Langkah 1: Buka Rekening Saham (RDN)', p: 'Pilih sekuritas resmi yang terdaftar dan diawasi OJK. Bandingkan biaya transaksi (fee beli biasanya 0,1-0,2%, fee jual sedikit lebih tinggi). Siapkan KTP, NPWP (opsional di sebagian sekuritas), dan buku tabungan. Proses pembukaan kini sepenuhnya online dan biasanya selesai 1-3 hari kerja. Setelah disetujui, kamu mendapat Rekening Dana Nasabah (RDN) untuk menyimpan dana trading.' },
      { h: 'Langkah 2: Mulai dengan Modal yang Aman', p: 'Aturan emas: hanya gunakan uang dingin — dana yang tidak kamu butuhkan dalam 1-3 tahun ke depan. Jangan pernah pakai uang dapur, dana darurat, apalagi uang pinjaman. Untuk pemula, mulai Rp 100.000-1.000.000 sudah cukup untuk belajar mekanisme pasar. Tujuan awal bukan profit besar, tapi memahami cara kerja, mengelola emosi, dan membangun kebiasaan disiplin.' },
      { h: 'Langkah 3: Pilih Saham yang Tepat untuk Pemula', p: 'Hindari saham "gorengan" (harga naik-turun ekstrem tanpa fundamental jelas) yang sering menjebak pemula. Mulailah dengan saham blue chip di indeks LQ45 atau IDX30 — perusahaan besar, likuid, dan stabil seperti sektor perbankan dan konsumer. Saham ini lebih mudah dianalisis dan tidak mudah dimanipulasi. Pelajari fundamental dasar: apakah perusahaan untung konsisten, utangnya wajar, dan industrinya bertumbuh.' },
      { h: 'Langkah 4: Belajar Analisis Dasar', p: 'Ada dua pendekatan: analisis fundamental (menilai kesehatan dan nilai wajar perusahaan) dan analisis teknikal (membaca grafik harga untuk timing). Pemula sebaiknya paham keduanya secukupnya. Untuk investasi jangka panjang, fundamental lebih penting. Untuk timing beli/jual, teknikal seperti RSI, MACD, dan support-resistance membantu. Tools sinyal otomatis bisa mempercepat proses belajar timing ini.' },
      { h: 'Langkah 5: Kelola Risiko dan Psikologi', p: 'Jangan menaruh semua dana di satu saham — diversifikasi ke 3-5 saham dari sektor berbeda. Tentukan batas kerugian (stop loss) sebelum membeli, dan patuhi. Jangan panik jual saat pasar merah, dan jangan serakah saat hijau. Investor sukses kalah dalam disiplin, bukan kepintaran. Catat setiap transaksi dan alasannya untuk evaluasi.' },
      { h: 'Langkah 6: Konsisten dan Sabar', p: 'Kekayaan dari saham dibangun lewat compounding (bunga berbunga) dalam jangka panjang, bukan dari satu trade beruntung. Investor legendaris membangun kekayaan selama puluhan tahun. Mulai kecil, belajar terus, tambah modal secara bertahap seiring meningkatnya pemahaman. Gunakan TradeSignal Pro untuk membantu timing entry dan exit, tapi keputusan akhir tetap di tanganmu berdasarkan rencana yang matang.' },
    ],
  },
  'bitcoin-crypto-untuk-pemula': {
    title: 'Bitcoin dan Crypto untuk Pemula: Panduan Memahami Aset Digital',
    category: 'Edukasi', date: '13 Jun 2025', readTime: '11 menit',
    intro: 'Cryptocurrency telah menjadi kelas aset yang tidak bisa diabaikan. Namun di balik potensi keuntungannya, crypto sangat volatil dan penuh risiko. Panduan ini menjelaskan dasar-dasar Bitcoin dan crypto secara objektif untuk pemula, termasuk risikonya, agar kamu bisa mengambil keputusan yang sadar.',
    sections: [
      { h: 'Apa Itu Bitcoin dan Cryptocurrency', p: 'Bitcoin adalah mata uang digital terdesentralisasi yang diciptakan pada 2009. Tidak ada bank sentral atau pemerintah yang mengontrolnya; transaksi diverifikasi oleh jaringan komputer global menggunakan teknologi blockchain — buku besar digital yang transparan dan tidak bisa diubah. Selain Bitcoin (BTC), ada ribuan "altcoin" lain seperti Ethereum (ETH) yang punya fungsi berbeda, mulai dari kontrak pintar hingga aplikasi terdesentralisasi.' },
      { h: 'Cara Kerja Blockchain Secara Sederhana', p: 'Bayangkan buku catatan yang disalin ke ribuan komputer sekaligus. Setiap transaksi baru dicatat di semua salinan, dan harus disetujui mayoritas jaringan. Karena tersebar, tidak ada satu pihak yang bisa memalsukan atau menghapus catatan. Inilah yang membuat blockchain aman dan transparan. "Mining" adalah proses komputer memverifikasi transaksi dan, sebagai imbalan, mendapat crypto baru.' },
      { h: 'Mengapa Harga Crypto Sangat Volatil', p: 'Harga crypto bisa naik atau turun puluhan persen dalam sehari — jauh lebih liar dari saham. Penyebabnya: pasar relatif baru dan kecil, sangat dipengaruhi sentimen dan berita, banyak spekulasi, serta tidak ada batas harga harian seperti bursa saham. Volatilitas ini berarti peluang besar sekaligus risiko besar. Banyak pemula tergoda FOMO membeli saat harga puncak lalu panik jual saat turun — pola yang merugikan.' },
      { h: 'Risiko yang Wajib Dipahami', p: 'Crypto bukan investasi tanpa risiko. Harga bisa turun drastis dan tidak kembali. Ada risiko penipuan (scam), proyek koin tanpa nilai nyata, dan kehilangan akses dompet digital. Regulasi masih berkembang. Aturan paling penting: jangan pernah menaruh uang yang tidak siap kamu hilangkan. Banyak ahli menyarankan crypto hanya porsi kecil (misalnya 5-10%) dari total portofolio, bukan seluruh tabungan.' },
      { h: 'Cara Mulai dengan Aman', p: 'Gunakan exchange yang terdaftar dan diawasi regulator di Indonesia (Bappebti). Aktifkan keamanan dua langkah (2FA). Mulai dengan jumlah kecil untuk belajar. Pelajari proyek sebelum membeli — pahami apa fungsi koin tersebut, siapa tim di baliknya, dan apakah ada nilai nyata. Hindari koin yang dipromosikan dengan janji keuntungan pasti; itu tanda bahaya. Pertimbangkan strategi DCA (dollar cost averaging) — membeli rutin dalam jumlah kecil untuk meratakan harga.' },
      { h: 'Analisis Teknikal pada Crypto', p: 'Karena crypto diperdagangkan 24/7 dan sangat teknikal, indikator seperti RSI, MACD, dan Bollinger Bands sangat berguna untuk timing. Pola candlestick juga berlaku. Namun ingat, sentimen dan berita bisa membatalkan sinyal teknikal kapan saja. TradeSignal Pro memantau instrumen crypto utama dan memberi sinyal berbasis analisis multi-indikator — gunakan sebagai alat bantu, selalu dengan manajemen risiko ketat mengingat volatilitas crypto yang ekstrem.' },
    ],
  },
  'manajemen-modal-trading': {
    title: 'Manajemen Modal Trading: Kunci Bertahan dan Konsisten Profit',
    category: 'Manajemen Risiko', date: '12 Jun 2025', readTime: '10 menit',
    intro: 'Banyak trader fokus mencari strategi entry sempurna, padahal yang membedakan trader sukses dari yang bangkrut adalah manajemen modal (money management). Dengan manajemen modal yang benar, kamu bisa profit konsisten meski win rate hanya 50%. Tanpa itu, strategi terbaik pun akan menghapus akunmu.',
    sections: [
      { h: 'Mengapa Manajemen Modal Lebih Penting dari Strategi', p: 'Bayangkan dua trader dengan strategi sama persis. Trader A mempertaruhkan 2% modal per trade, Trader B mempertaruhkan 25%. Setelah 5 kali kalah beruntun (yang pasti terjadi suatu saat), Trader A masih punya ~90% modal dan bisa lanjut. Trader B kehilangan ~76% modal dan butuh untung 300% hanya untuk balik modal. Inilah kenapa manajemen modal adalah fondasi: ia memastikan kamu bertahan cukup lama agar strategimu bekerja.' },
      { h: 'Aturan Risiko 1-2% per Trade', p: 'Aturan paling fundamental: jangan pernah risiko lebih dari 1-2% total modal dalam satu trade. Jika modal Rp 10 juta, risiko maksimal per trade adalah Rp 100.000-200.000. "Risiko" di sini adalah selisih antara harga masuk dan stop loss dikali jumlah unit. Aturan ini membuat serangkaian kerugian (yang tak terhindarkan) tidak menghancurkan akun, dan menjaga emosi tetap stabil karena tidak ada satu trade pun yang menentukan nasibmu.' },
      { h: 'Position Sizing: Menghitung Ukuran Posisi', p: 'Position sizing adalah menghitung berapa banyak unit yang dibeli berdasarkan risiko yang diizinkan. Rumusnya: Ukuran Posisi = (Modal × % Risiko) ÷ (Jarak Stop Loss). Contoh: modal Rp 10 juta, risiko 2% (Rp 200.000), jarak entry ke stop loss Rp 50 per lembar — maka ukuran posisi = 200.000 ÷ 50 = 4.000 lembar (40 lot). Cara ini membuat setiap trade punya risiko rupiah yang sama meski jarak stop loss berbeda. TradeSignal Pro menyediakan kalkulator position sizing untuk ini.' },
      { h: 'Risk/Reward Ratio dan Ekspektasi', p: 'Risk/Reward (R/R) adalah perbandingan potensi kerugian dengan potensi keuntungan. R/R 1:2 berarti risiko Rp 100.000 untuk target Rp 200.000. Dengan R/R 1:2 dan win rate hanya 40%, kamu tetap profit dalam jangka panjang. Ini konsep "expectancy": yang penting bukan seberapa sering kamu benar, tapi seberapa besar menang dibanding kalah. Hindari trade dengan R/R di bawah 1:1.5 — secara matematis sulit profitable.' },
      { h: 'Mengelola Drawdown dan Psikologi', p: 'Drawdown adalah penurunan modal dari puncak. Setiap trader mengalaminya. Kuncinya: punya rencana saat drawdown. Banyak trader menurunkan ukuran posisi saat sedang rugi beruntun untuk melindungi modal dan mental. Hindari "revenge trading" — memperbesar posisi untuk balas dendam atas kerugian, yang justru mempercepat kehancuran. Manajemen modal yang baik menjaga kerugian tetap kecil sehingga secara psikologis kamu bisa tetap tenang dan rasional.' },
      { h: 'Membangun Sistem yang Berkelanjutan', p: 'Manajemen modal bukan aturan kaku sekali pakai, tapi sistem yang kamu jalankan konsisten setiap trade: tentukan risiko, hitung ukuran posisi, pasang stop loss dan take profit, lalu eksekusi tanpa emosi. Jurnal setiap trade untuk mengevaluasi apakah kamu mematuhi sistem. Trader profesional menganggap dirinya manajer risiko terlebih dahulu, baru pencari profit. Gunakan tools dan sinyal sebagai pendukung, tapi disiplin manajemen modal adalah tanggung jawab pribadi yang tak bisa diwakilkan.' },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(ARTICLES).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = ARTICLES[params.slug];
  if (!article) return { title: 'Artikel tidak ditemukan' };
  const desc = article.intro.length > 155 ? article.intro.slice(0, 152) + '...' : article.intro;
  const url = `https://tradesignalpro.web.id/blog/${params.slug}/`;
  return {
    title: article.title,
    description: desc,
    alternates: { canonical: `/blog/${params.slug}/` },
    openGraph: {
      title: article.title,
      description: desc,
      url,
      type: 'article',
      publishedTime: article.date,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: desc,
    },
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = ARTICLES[params.slug];

  if (!article) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#060B18] pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Artikel tidak ditemukan</h1>
            <Link href="/blog" className="text-[#00D4FF] hover:underline">← Kembali ke Blog</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.intro,
            datePublished: article.date,
            author: { '@type': 'Organization', name: 'TradeSignal Pro' },
            publisher: {
              '@type': 'Organization',
              name: 'TradeSignal Pro',
              logo: { '@type': 'ImageObject', url: 'https://tradesignalpro.web.id/icon-512.png' },
            },
            mainEntityOfPage: `https://tradesignalpro.web.id/blog/${params.slug}/`,
          }),
        }}
      />
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#8BA8C2] hover:text-[#00D4FF] text-sm mb-8 transition-colors">
            <ArrowLeft size={14} /> Kembali ke Blog
          </Link>

          <div className="mb-3">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">
              {article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">{article.title}</h1>

          <div className="flex items-center gap-4 text-[#4A6080] text-xs mb-6 pb-6 border-b border-white/5">
            <span className="flex items-center gap-1"><Clock size={11} /> {article.readTime}</span>
            <span className="flex items-center gap-1"><BookOpen size={11} /> {article.date}</span>
          </div>

          <p className="text-[#8BA8C2] leading-relaxed mb-8 text-base">{article.intro}</p>

          <div className="space-y-6">
            {article.sections.map((s, i) => (
              <div key={i} className="p-6 rounded-2xl glass border border-white/8">
                <h2 className="text-white font-bold text-lg mb-3">{s.h}</h2>
                <p className="text-[#8BA8C2] leading-relaxed text-sm">{s.p}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Terapkan dengan Sinyal Real</h3>
            <p className="text-[#8BA8C2] text-sm mb-5">Dapatkan sinyal trading otomatis berbasis indikator yang baru kamu pelajari</p>
            <Link href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
              <Zap size={14} fill="white" /> Mulai Gratis →
            </Link>
          </div>

          {/* Artikel Lainnya — internal linking untuk SEO */}
          {(() => {
            const others = Object.entries(ARTICLES).filter(([slug]) => slug !== params.slug).slice(0, 3);
            return (
              <div className="mt-12">
                <h3 className="text-white font-bold text-lg mb-4">Artikel Lainnya</h3>
                <div className="grid gap-3">
                  {others.map(([slug, a]) => (
                    <Link key={slug} href={`/blog/${slug}/`}
                      className="flex items-center justify-between gap-4 p-4 rounded-xl glass border border-white/8 hover:border-[#00D4FF]/30 transition-colors group">
                      <div>
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">{a.category}</span>
                        <p className="text-white text-sm font-semibold mt-1.5 group-hover:text-[#00D4FF] transition-colors">{a.title}</p>
                      </div>
                      <ArrowLeft size={16} className="text-[#4A6080] rotate-180 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
      <Footer />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Beranda', item: 'https://tradesignalpro.web.id/' },
              { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://tradesignalpro.web.id/blog/' },
              { '@type': 'ListItem', position: 3, name: article.title, item: `https://tradesignalpro.web.id/blog/${params.slug}/` },
            ],
          }),
        }}
      />
    </>
  );
}
