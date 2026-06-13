'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Zap, LogOut, BarChart2, TrendingUp, ChevronDown, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import NotificationBell from './NotificationBell';
import { PLAN_DISPLAY, PLAN_COLOR } from '@/types';

const PUBLIC_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/#pricing', label: 'Harga' },
  { href: '/edukasi', label: 'Edukasi' },
  { href: '/blog', label: 'Blog' },
];


export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hash, setHash] = useState('');
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onHash = () => setHash(window.location.hash);
    onHash();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // Show protected links only after mount + when logged in (avoids hydration mismatch)
  const navLinks = mounted && user
    ? [
        { href: '/', label: 'Home' },
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/signals', label: 'Sinyal' },
        { href: '/screener', label: 'Screener' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/upgrade', label: 'Harga' },
        { href: '/edukasi', label: 'Edukasi' },
        { href: '/blog', label: 'Blog' },
      ]
    : PUBLIC_LINKS;

  // Active-link aware of hash links like "/#pricing"
  const isLinkActive = (href: string) => {
    if (href.includes('#')) {
      const [base, frag] = href.split('#');
      const basePath = base || '/';
      return pathname === basePath && hash === `#${frag}`;
    }
    // Plain path is active only when no hash is present (so "/#pricing" doesn't also light up "Home")
    if (href === '/') return pathname === '/' && !hash;
    return pathname === href;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2'
          : 'py-3'
      }`}>
        {/* Glass background */}
        <div className={`absolute inset-0 transition-all duration-500 ${
          scrolled
            ? 'bg-[#060B18]/85 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={16} className="text-white" fill="white" />
                </div>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-black text-sm tracking-widest">
                  <span className="text-[#00D4FF]">TRADE</span><span className="text-white">SIGNAL</span>
                </span>
                <span className="text-[#7B2FFF] text-[9px] font-mono font-bold tracking-[0.3em] uppercase">Pro Platform</span>
              </div>
            </Link>

            {/* Desktop Nav — pill container */}
            <div className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-2xl bg-white/4 border border-white/8 backdrop-blur-sm">
              {navLinks.map((link) => {
                const isActive = isLinkActive(link.href);
                return (
                  <Link key={link.href} href={link.href}
                    onClick={() => setHash(link.href.includes('#') ? '#' + link.href.split('#')[1] : '')}
                    className={`relative px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-[#8BA8C2] hover:text-white'
                    }`}>
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#7B2FFF]/20 border border-[#00D4FF]/25" />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-2.5">
              {/* Live indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00E676]/8 border border-[#00E676]/20 text-[#00E676] text-[11px] font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                LIVE
              </div>

              {mounted && user && <NotificationBell />}

              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 hover:border-white/15 transition-all">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-black">{user.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-white text-xs font-semibold max-w-[80px] truncate">{user.name}</span>
                    <ChevronDown size={12} className={`text-[#4A6080] transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-white/10 shadow-card overflow-hidden z-50"
                      style={{ background: 'rgba(10,17,40,0.97)', backdropFilter: 'blur(20px)' }}>
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-white text-sm font-semibold">{user.name}</p>
                        <p className={`text-xs ${PLAN_COLOR[user.plan]}`}>{PLAN_DISPLAY[user.plan]}</p>
                      </div>
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#8BA8C2] hover:text-white hover:bg-white/5 transition-colors">
                        <BarChart2 size={13} /> Dashboard
                      </Link>
                      <Link href="/portfolio" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#8BA8C2] hover:text-white hover:bg-white/5 transition-colors">
                        <TrendingUp size={13} /> Portfolio
                      </Link>
                      <Link href="/upgrade" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#FFD700] hover:bg-[#FFD700]/8 transition-colors">
                        <Crown size={13} /> Upgrade Plan
                      </Link>
                      <div className="border-t border-white/5" />
                      <button onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#FF4757] hover:bg-[#FF4757]/8 transition-colors">
                        <LogOut size={13} /> Keluar
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/auth/login"
                    className="px-4 py-2 rounded-xl text-[13px] text-[#8BA8C2] hover:text-white font-medium transition-colors">
                    Masuk
                  </Link>
                  <Link href="/auth/register"
                    className="relative px-5 py-2 rounded-xl text-[13px] font-bold text-white overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Zap size={12} fill="white" />
                      Mulai Gratis
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle + bell */}
            <div className="lg:hidden flex items-center gap-2">
              {mounted && user && <NotificationBell />}
              <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#8BA8C2] hover:text-white transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 border-t border-white/5 z-40"
            style={{ background: 'rgba(6,11,24,0.98)', backdropFilter: 'blur(24px)' }}>
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isLinkActive(link.href)
                      ? 'bg-gradient-to-r from-[#00D4FF]/15 to-[#7B2FFF]/15 text-[#00D4FF] border border-[#00D4FF]/20'
                      : 'text-[#8BA8C2] hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                  {isLinkActive(link.href) && <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />}
                </Link>
              ))}
              <div className="pt-3 grid grid-cols-2 gap-2">
                {user ? (
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="col-span-2 py-3 rounded-xl border border-[#FF4757]/30 text-[#FF4757] text-sm font-semibold">
                    Keluar
                  </button>
                ) : (
                  <>
                    <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                      className="py-3 rounded-xl border border-white/12 text-[#8BA8C2] text-sm font-medium text-center hover:border-[#00D4FF]/30 hover:text-white transition-all">
                      Masuk
                    </Link>
                    <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                      className="py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-sm font-bold text-center">
                      Mulai Gratis
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
