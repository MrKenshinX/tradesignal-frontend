import Link from 'next/link';
import { Zap, ExternalLink, Send, MessageCircle, PlayCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative bg-[#060B18] border-t border-[#00D4FF]/10 pt-16 pb-8 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-[#00D4FF]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-[#7B2FFF]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-base">
                <span className="text-[#00D4FF]">TRADE</span><span className="text-white">SIGNAL</span>
                <span className="text-[#7B2FFF] text-xs ml-1 font-mono">PRO</span>
              </span>
            </div>
            <p className="text-[#8BA8C2] text-sm leading-relaxed mb-4">
              Platform sinyal trading otomatis berbasis AI. Data real-time dari Yahoo Finance, Finnhub & Binance.
            </p>
            <div className="flex gap-3">
              {[Send, MessageCircle, PlayCircle].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA8C2] hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: [
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Sinyal Trading', href: '/signals' },
              { label: 'Screener', href: '/screener' },
              { label: 'Portfolio', href: '/portfolio' },
            ]},
            { title: 'Resources', links: [
              { label: 'Edukasi Trading', href: '/edukasi' },
              { label: 'Blog', href: '/blog' },
              { label: 'Harga & Paket', href: '/#pricing' },
              { label: 'API Docs', href: '#' },
            ]},
            { title: 'Legal', links: [
              { label: 'Kebijakan Privasi', href: '/privacy' },
              { label: 'Syarat & Ketentuan', href: '/terms' },
              { label: 'Disclaimer', href: '/disclaimer' },
              { label: 'Kontak', href: '/contact' },
            ]},
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[#8BA8C2] hover:text-[#00D4FF] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Referral Banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#00D4FF]/10 to-[#7B2FFF]/10 border border-[#00D4FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-white text-sm font-semibold">🎁 Belum punya akun Ajaib?</p>
            <p className="text-[#8BA8C2] text-xs mt-0.5">Daftar sekarang dan dapatkan bonus investasi eksklusif untuk pengguna TradeSignal Pro</p>
          </div>
          <a
            href="https://ajaib.onelink.me/SIjL/q0at7dq2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-sm font-semibold whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Daftar Ajaib <ExternalLink size={13} />
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          <p className="text-[#4A6080] text-xs">
            © 2025 TradeSignal Pro. Data pasar dari Yahoo Finance, Finnhub, Binance.
          </p>
          <p className="text-[#4A6080] text-xs text-center sm:text-right">
            ⚠️ Disclaimer: Sinyal bukan saran investasi. Investasi mengandung risiko.
          </p>
        </div>
      </div>
    </footer>
  );
}
