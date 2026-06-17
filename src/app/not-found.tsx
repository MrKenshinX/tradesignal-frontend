import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Halaman Tidak Ditemukan',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060B18] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-[7rem] leading-none font-black bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">404</p>
        <h1 className="text-white text-xl font-bold mt-2 mb-3">Halaman tidak ditemukan</h1>
        <p className="text-[#8BA8C2] text-sm mb-8">
          Halaman yang kamu cari mungkin sudah dipindahkan atau tidak ada. Yuk kembali ke jalur yang benar.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
            ← Kembali ke Beranda
          </Link>
          <Link href="/signals" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all">
            Lihat Sinyal Trading
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 justify-center text-xs text-[#4A6080]">
          <Link href="/blog" className="hover:text-[#00D4FF]">Blog</Link>
          <Link href="/edukasi" className="hover:text-[#00D4FF]">Edukasi</Link>
          <Link href="/tools" className="hover:text-[#00D4FF]">Kalkulator</Link>
          <Link href="/game" className="hover:text-[#00D4FF]">Game</Link>
          <Link href="/contact" className="hover:text-[#00D4FF]">Kontak</Link>
        </div>
      </div>
    </div>
  );
}
