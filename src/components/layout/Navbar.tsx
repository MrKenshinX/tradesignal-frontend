'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, BarChart2, TrendingUp, BookOpen, LogOut, User, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { PLAN_DISPLAY, PLAN_COLOR } from '@/types';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/signals', label: 'Sinyal' },
  { href: '/screener', label: 'Screener' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/edukasi', label: 'Edukasi' },
  { href: '/blog', label: 'Blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#060B18]/92 backdrop-blur-xl border-b border-[#00D4FF]/8 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center shadow-glow-cyan-sm group-hover:shadow-glow-cyan transition-all duration-300">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-display font-black text-base tracking-wide">
              <span className="text-[#00D4FF]">TRADE</span>
              <span className="text-white">SIGNAL</span>
              <span className="text-[#7B2FFF] text-[10px] ml-1 font-mono font-bold">PRO</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'text-[#00D4FF] bg-[#00D4FF]/10'
                    : 'text-[#8BA8C2] hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth / User */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold">{user.name}</p>
                    <p className={`text-[10px] font-medium ${PLAN_COLOR[user.plan]}`}>{PLAN_DISPLAY[user.plan]}</p>
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 glass border border-white/10 rounded-xl shadow-card overflow-hidden">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#8BA8C2] hover:text-white hover:bg-white/5 transition-colors">
                      <BarChart2 size={14} /> Dashboard
                    </Link>
                    <Link href="/portfolio" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#8BA8C2] hover:text-white hover:bg-white/5 transition-colors">
                      <TrendingUp size={14} /> Portfolio
                    </Link>
                    <div className="border-t border-white/5" />
                    <button onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#FF4757] hover:bg-[#FF4757]/10 transition-colors">
                      <LogOut size={14} /> Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-[#8BA8C2] hover:text-white transition-colors px-3 py-2">
                  Masuk
                </Link>
                <Link href="/auth/register"
                  className="text-sm font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white hover:opacity-90 transition-opacity shadow-glow-cyan-sm">
                  Mulai Gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-[#8BA8C2] hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#00D4FF]/10" style={{ background: 'rgba(6,11,24,0.97)', backdropFilter: 'blur(20px)' }}>
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  pathname === link.href ? 'text-[#00D4FF] bg-[#00D4FF]/10' : 'text-[#8BA8C2] hover:text-white hover:bg-white/5'
                }`}>
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-full text-center py-2.5 rounded-xl border border-[#FF4757]/30 text-[#FF4757] text-sm font-medium">
                  Keluar
                </button>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                    className="block text-center py-2.5 rounded-xl border border-[#00D4FF]/30 text-[#00D4FF] text-sm font-medium">
                    Masuk
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                    className="block text-center py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-sm font-bold">
                    Mulai Gratis
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
