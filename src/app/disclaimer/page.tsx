import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Disclaimer' };

export default function DisclaimerPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Disclaimer</h1>
            <p className="text-[#4A6080] text-sm">Penting untuk dibaca sebelum menggunakan layanan</p>
          </div>

          {/* Main Warning */}
          <div className="p-6 rounded-2xl bg-[#FF4757]/10 border border-[#FF4757]/30 mb-8">
            <h2 className="text-[#FF4757] font-bold text-lg mb-3">⚠️ Peringatan Risiko Investasi</h2>
            <p className="text-[#8BA8C2] leading-relaxed text-sm">
              Trading saham, forex, dan cryptocurrency mengandung risiko kerugian yang signifikan.
              Nilai investasi dapat turun maupun naik, dan kamu dapat kehilangan sebagian atau seluruh modal yang diinvestasikan.
              Pastikan kamu memahami risiko yang terlibat sebelum melakukan trading.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Bukan Saran Investasi', content: 'Sinyal dan informasi yang disediakan TradeSignal Pro adalah untuk tujuan edukasi dan informasi saja. Ini BUKAN merupakan saran investasi, rekomendasi keuangan, atau ajakan untuk membeli atau menjual sekuritas apapun.' },
              { title: 'Akurasi Data', content: 'Meskipun kami berusaha menyediakan data yang akurat dari Yahoo Finance, Finnhub, dan Binance, kami tidak menjamin keakuratan, kelengkapan, atau ketepatan waktu informasi yang disediakan.' },
              { title: 'Kinerja Masa Lalu', content: 'Kinerja sinyal di masa lalu tidak menjamin hasil di masa depan. Pasar keuangan bersifat tidak pasti dan dapat berubah dengan cepat.' },
              { title: 'Tanggung Jawab Pengguna', content: 'Setiap keputusan trading yang kamu buat sepenuhnya merupakan tanggung jawabmu. Lakukan riset sendiri (DYOR - Do Your Own Research) sebelum mengambil keputusan investasi.' },
              { title: 'Tidak Ada Jaminan Profit', content: 'TradeSignal Pro tidak menjamin keuntungan dari penggunaan sinyal kami. Confidence score hanya mencerminkan kekuatan sinyal teknikal, bukan jaminan pergerakan harga.' },
              { title: 'Konsultasi Profesional', content: 'Untuk keputusan investasi besar, disarankan untuk berkonsultasi dengan penasihat keuangan berlisensi yang memahami situasi keuangan pribadimu.' },
            ].map((s) => (
              <div key={s.title} className="p-6 rounded-2xl glass border border-white/8">
                <h2 className="text-white font-semibold text-base mb-3">{s.title}</h2>
                <p className="text-[#8BA8C2] leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
