import Link from 'next/link';
import { Zap, ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="relative py-24 bg-[#060B18] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060B18] via-[#0A1128] to-[#060B18]" />
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#00D4FF]/8 blur-[100px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-[#7B2FFF]/8 blur-[80px] rounded-full" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
          Signal Engine Aktif 24/7
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6">
          Mulai Trading Lebih<br />
          <span className="bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-[#00E676] bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
            Cerdas Hari Ini
          </span>
        </h2>

        <p className="text-[#8BA8C2] text-lg mb-10 max-w-2xl mx-auto">
          Sinyal AI dengan 6 indikator teknikal, update setiap 5 menit.
          Gratis untuk memulai, upgrade kapan kamu siap.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group flex items-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-base shadow-glow-cyan hover:scale-[1.03] transition-all duration-300"
          >
            <Zap size={18} fill="white" />
            Daftar Gratis Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/#pricing"
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-[#00D4FF] border border-[#00D4FF]/30 font-semibold text-base hover:bg-[#00D4FF]/10 transition-all duration-300"
          >
            Lihat Harga Paket
          </Link>
        </div>

        <p className="mt-6 text-[#4A6080] text-xs">
          Tidak perlu kartu kredit • Akun Free permanen • Upgrade kapan saja
        </p>
      </div>
    </section>
  );
}
