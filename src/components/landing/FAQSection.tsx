'use client';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Apa itu sinyal trading?',
    a: 'Sinyal trading adalah rekomendasi beli (BUY) atau jual (SELL) untuk suatu aset, lengkap dengan harga masuk (entry), target profit (take profit), dan batas rugi (stop loss). TradeSignal Pro menghasilkan sinyal otomatis berdasarkan analisis teknikal seperti RSI, MACD, Bollinger Bands, dan ADX.',
  },
  {
    q: 'Apakah TradeSignal Pro bisa dipakai gratis?',
    a: 'Ya, tersedia paket gratis untuk mencoba platform. Untuk akses penuh ke sinyal unlimited, auto stop-loss/take-profit, dan fitur premium lainnya, tersedia paket berlangganan mulai dari Rp 100.000/bulan.',
  },
  {
    q: 'Aset apa saja yang didukung?',
    a: 'TradeSignal Pro mendukung saham Indonesia (IDX), saham asing (NYSE/NASDAQ), dan cryptocurrency. Data harga diperbarui secara real-time dari sumber terpercaya seperti Yahoo Finance, Finnhub, dan Binance.',
  },
  {
    q: 'Bagaimana cara kerja sinyal otomatis?',
    a: 'Sistem menganalisis data harga historis dan terkini menggunakan kombinasi indikator teknikal. Setiap sinyal diberi skor kepercayaan (confidence) dan dilengkapi level stop-loss serta take-profit yang dihitung otomatis berbasis volatilitas (ATR). Sinyal diperbarui setiap 5 menit.',
  },
  {
    q: 'Apakah sinyal menjamin keuntungan?',
    a: 'Tidak. Sinyal trading adalah alat bantu analisis, bukan jaminan keuntungan. Semua bentuk trading dan investasi memiliki risiko. Kinerja masa lalu tidak menjamin hasil di masa depan. Selalu lakukan riset sendiri dan kelola risiko dengan bijak.',
  },
  {
    q: 'Apa itu stop-loss dan take-profit?',
    a: 'Stop-loss adalah batas harga untuk membatasi kerugian — posisi otomatis ditutup jika harga bergerak melawan kita hingga level ini. Take-profit adalah target harga untuk merealisasikan keuntungan. Keduanya membantu manajemen risiko yang disiplin.',
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative py-24 bg-[#060B18]" id="faq">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-4">
            <HelpCircle size={12} /> FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-[#8BA8C2]">Hal-hal yang perlu kamu tahu tentang TradeSignal Pro</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-2xl glass border border-white/8 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-white/3 transition-colors"
              >
                <span className="text-white font-semibold text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#00D4FF] shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-[#8BA8C2] text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FAQPage JSON-LD untuk rich snippet Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </section>
  );
}
