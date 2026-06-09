'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, BarChart2, TrendingUp, BookOpen, User, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/signals', label: 'Sinyal', icon: Zap },
  { href: '/screener', label: 'Screener', icon: BarChart2 },
  { href: '/portfolio', label: 'Portfolio', icon: TrendingUp },
  { href: '/edukasi', label: 'Edukasi', icon: BookOpen },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#060B18]/90 backdrop-blur-xl border-b border-cyan-neon/10 shadow-[0_4px_20px_rgba(0,212,255,0.05)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center shadow-glow-cyan-sm group-hover:shadow-glow-cyan transition-all duration-300">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg tracking-wide">
              <span className="text-[#00D4FF] text-glow-cyan">TRADE</span>
              <span className="text-white">SIGNAL</span>
              <span className="text-[#7B2FFF] text-xs ml-1 font-mono">PRO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#00D4FF] bg-[#00D4FF]/10 text-glow-cyan'
                    : 'text-[#8BA8C2] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-[#8BA8C2] hover:text-white transition-colors px-3 py-2">
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white hover:opacity-90 transition-opacity shadow-glow-cyan-sm"
            >
              Mulai Gratis
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-[#8BA8C2] hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A1128]/95 backdrop-blur-xl border-t border-[#00D4FF]/10">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'text-[#00D4FF] bg-[#00D4FF]/10'
                    : 'text-[#8BA8C2] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="block text-center py-2.5 rounded-lg border border-[#00D4FF]/30 text-[#00D4FF] text-sm font-medium">
                Masuk
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                className="block text-center py-2.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-sm font-semibold">
                Mulai Gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
