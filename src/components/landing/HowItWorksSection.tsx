'use client';
import { motion } from 'framer-motion';
import { Database, Cpu, Gauge, Send } from 'lucide-react';

const STEPS = [
  {
    icon: Database,
    step: '01',
    title: 'Data Real-Time Masuk',
    desc: 'Harga & volume dari Yahoo Finance (saham IDN/Asing), Finnhub, dan Binance WebSocket (crypto) ditarik setiap 5 menit ke database.',
    color: '#00D4FF',
  },
  {
    icon: Cpu,
    step: '02',
    title: 'Analisis Multi-Indikator',
    desc: 'Engine menghitung RSI, MACD, Bollinger Bands, EMA, Stochastic, dan ATR secara simultan untuk setiap instrumen.',
    color: '#7B2FFF',
  },
  {
    icon: Gauge,
    step: '03',
    title: 'Confidence Score 0-100',
    desc: 'Sinyal BUY/SELL diberi skor berdasarkan konvergensi indikator. Semakin banyak indikator searah, semakin tinggi skornya.',
    color: '#FFD700',
  },
  {
    icon: Send,
    step: '04',
    title: 'Sinyal + Auto SL/TP',
    desc: 'Sinyal terbit lengkap dengan Stop-Loss & Take-Profit yang dihitung dari ATR — langsung muncul di dashboard & notifikasi kamu.',
    color: '#00E676',
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-20 bg-[#060B18] overflow-hidden">
      <div className="absolute inset-0 bg-grid-sm opacity-10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/25 text-[#B794FF] text-xs font-mono mb-4">
            ⚙ Cara Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            Dari Data Mentah ke{' '}
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">
              Sinyal Siap Eksekusi
            </span>
          </h2>
          <p className="text-[#8BA8C2] text-sm mt-3 max-w-xl mx-auto">
            Transparan dan sistematis — beginilah tepatnya Signal Engine kami bekerja, tanpa black box.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-2xl glass border border-white/8 p-6 group hover:border-white/15 transition-colors"
              >
                <span className="absolute top-5 right-5 text-4xl font-display font-black text-white/5 group-hover:text-white/10 transition-colors">
                  {s.step}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                >
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <h3 className="text-white font-display font-bold text-base mb-2">{s.title}</h3>
                <p className="text-[#8BA8C2] text-xs leading-relaxed">{s.desc}</p>

                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2.5 w-5 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[#4A6080] text-xs mt-10">
          ⚠️ Sinyal adalah hasil analisis teknikal otomatis, bukan saran investasi. Selalu lakukan riset mandiri.
        </p>
      </div>
    </section>
  );
}
