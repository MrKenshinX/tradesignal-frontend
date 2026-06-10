import Link from 'next/link';
import { Zap, ExternalLink, Send, MessageCircle, PlayCircle } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Sinyal Trading', href: '/signals' },
      { label: 'Screener', href: '/screener' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Edukasi Trading', href: '/edukasi' },
      { label: 'Blog', href: '/blog' },
      { label: 'Harga & Paket', href: '/#pricing' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Kebijakan Privasi', href: '/privacy' },
      { label: 'Syarat & Ketentuan', href: '/terms' },
      { label: 'Disclaimer', href: '/disclaimer' },
      { label: 'Kontak', href: '/contact' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#060B18] border-t border-white/5 pt-14 pb-8 overflow-hidden">
      {/* Ambient */}
      <div className="absolute bottom-0 left-1/4 w-96 h-48 bg-[#00D4FF]/4 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-[#7B2FFF]/4 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <div>
                <span className="font-display font-black text-sm">
                  <span className="text-[#00D4FF]">TRADE</span><span className="text-white">SIGNAL</span>
                </span>
                <span className="text-[#7B2FFF] text-[9px] font-mono font-bold block tracking-widest">PRO PLATFORM</span>
              </div>
            </Link>
            <p className="text-[#8BA8C2] text-sm leading-relaxed mb-5 max-w-xs">
              Platform sinyal trading otomatis berbasis AI. Data real-time dari Yahoo Finance, Finnhub & Binance WebSocket.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Send, href: '#', label: 'Telegram' },
                { icon: MessageCircle, href: '#', label: 'WhatsApp' },
                { icon: PlayCircle, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a key={label} href={href}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[#4A6080] hover:text-[#00D4FF] transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-bold text-xs mb-4 uppercase tracking-widest">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}
                      className="text-[#4A6080] hover:text-[#8BA8C2] text-sm transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Referral banner */}
        <div className="mb-8 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(123,47,255,0.06))', border: '1px solid rgba(0,212,255,0.12)' }}>
          <div>
            <p className="text-white text-sm font-bold mb-0.5">🎁 Belum punya akun Ajaib?</p>
            <p className="text-[#8BA8C2] text-xs">Daftar dan dapatkan bonus investasi eksklusif untuk pengguna TradeSignal Pro</p>
          </div>
          <a href="https://ajaib.onelink.me/SIjL/q0at7dq2" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-bold whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
            Daftar Ajaib <ExternalLink size={12} />
          </a>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5">
          <p className="text-[#4A6080] text-xs">© 2025 TradeSignal Pro. Data dari Yahoo Finance, Finnhub, Binance.</p>
          <p className="text-[#4A6080] text-xs">⚠️ Bukan saran investasi. Trading mengandung risiko.</p>
        </div>
      </div>
    </footer>
  );
}
