'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, TrendingUp, Shield, Clock, Activity } from 'lucide-react';
import { StarfieldCanvas } from './StarfieldCanvas';

interface PreviewItem {
  symbol: string; market: string; price: string; change: number;
}

// Fallback jika API belum termuat
const FALLBACK_PREVIEWS: PreviewItem[] = [
  { symbol: 'BBCA', market: 'IDN', price: '—', change: 0 },
  { symbol: 'BTCUSDT', market: 'CRYPTO', price: '—', change: 0 },
  { symbol: 'AAPL', market: 'ASING', price: '—', change: 0 },
  { symbol: 'TLKM', market: 'IDN', price: '—', change: 0 },
  { symbol: 'ETHUSDT', market: 'CRYPTO', price: '—', change: 0 },
];

const TYPING_TEXTS = [
  'Saham Indonesia',
  'Saham AS & Global', 
  'Cryptocurrency',
  '150+ Instrumen',
];

export function HeroSection() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [previews, setPreviews] = useState<PreviewItem[]>(FALLBACK_PREVIEWS);
  const [isReal, setIsReal] = useState(false);

  // Fetch real market data (public endpoints) — top movers
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [idnRes, cryptoRes, asingRes] = await Promise.all([
          fetch('/api/market/idn').then(r => r.json()).catch(() => null),
          fetch('/api/market/crypto').then(r => r.json()).catch(() => null),
          fetch('/api/market/asing').then(r => r.json()).catch(() => null),
        ]);
        type Raw = { symbol: string; price: string | number; change_pct: string | number };
        const tag = (rows: Raw[] | undefined, market: string): PreviewItem[] =>
          (rows ?? []).map((r) => ({
            symbol: r.symbol,
            market,
            price: Number(r.price ?? 0).toLocaleString('id-ID', { maximumFractionDigits: 2 }),
            change: Number(r.change_pct ?? 0),
          }));
        const merged = [
          ...tag(idnRes?.data, 'IDN'),
          ...tag(asingRes?.data, 'ASING'),
          ...tag(cryptoRes?.data, 'CRYPTO'),
        ].filter(p => p.price !== '0');
        if (merged.length >= 5 && !cancelled) {
          merged.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
          setPreviews(merged.slice(0, 5));
          setIsReal(true);
        }
      } catch { /* keep fallback */ }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setMounted(true);
    const signalInterval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(signalInterval);
  }, []);

  useEffect(() => {
    const current = TYPING_TEXTS[typingIdx];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypingText(current.slice(0, typingText.length + 1));
        if (typingText.length === current.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setTypingText(current.slice(0, typingText.length - 1));
        if (typingText.length === 0) {
          setIsDeleting(false);
          setTypingIdx((i) => (i + 1) % TYPING_TEXTS.length);
        }
      }
    }, isDeleting ? 50 : 80);
    return () => clearTimeout(timeout);
  }, [typingText, isDeleting, typingIdx]);


  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#060B18]">
      <StarfieldCanvas />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#00D4FF]/6 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-[#7B2FFF]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[300px] bg-[#00E676]/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />

      {/* Scan line */}
      <div className="absolute inset-0 scan-overlay pointer-events-none opacity-30" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 text-center">

        {/* Live badge */}
        <div className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#060B18] border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-8 shadow-glow-cyan-sm transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
          </span>
          Signal Engine LIVE — Update setiap 5 menit
          <Activity size={12} className="animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className={`max-w-5xl text-4xl sm:text-5xl lg:text-7xl font-display font-black leading-[1.0] mb-4 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="block text-white mb-2">Sinyal Trading AI</span>
          <span className="block relative">
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-[#00D4FF] bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
              untuk {typingText}
            </span>
            <span className="text-[#00D4FF] animate-blink">|</span>
          </span>
        </h1>

        <p className={`max-w-2xl text-[#8BA8C2] text-lg sm:text-xl leading-relaxed mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          RSI · MACD · Bollinger Bands · EMA · Stochastic · ATR<br className="hidden sm:block" />
          Auto Stop-Loss & Take-Profit. Data real dari Yahoo Finance, Finnhub & Binance.
        </p>

        {/* CTA */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/auth/register"
            className="group relative flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-white overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] transition-all duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Zap size={18} className="relative z-10" fill="white" />
            <span className="relative z-10">Mulai Gratis Sekarang</span>
            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-[#00D4FF]/20 text-white font-semibold text-base hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]/40 transition-all duration-300 backdrop-blur-sm">
            Lihat Demo Dashboard →
          </Link>
        </div>

        {/* Trust pills */}
        <div className={`flex flex-wrap items-center justify-center gap-3 mb-16 transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { icon: Shield, label: 'Data 100% Real — No Dummy' },
            { icon: Clock, label: 'Update Setiap 5 Menit' },
            { icon: TrendingUp, label: '150+ Instrumen Trading' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-[#8BA8C2] text-xs backdrop-blur-sm hover:border-[#00D4FF]/20 transition-colors">
              <Icon size={11} className="text-[#00D4FF]" />
              {label}
            </div>
          ))}
        </div>

        {/* Live Signal Preview */}
        <div className={`w-full max-w-5xl transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-[#4A6080] text-[11px] font-mono uppercase tracking-[0.2em] mb-5">— Live Market Movers —</p>

          <div className="relative rounded-2xl overflow-hidden border border-[#00D4FF]/15 shadow-[0_0_60px_rgba(0,212,255,0.08)]"
            style={{ background: 'rgba(6,11,24,0.8)', backdropFilter: 'blur(20px)' }}>

            {/* Window chrome */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5" style={{ background: 'rgba(10,17,40,0.8)' }}>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF4757]/70" />
                  <span className="w-3 h-3 rounded-full bg-[#FFD700]/70" />
                  <span className="w-3 h-3 rounded-full bg-[#00E676]/70" />
                </div>
                <span className="font-mono text-xs text-[#4A6080]">tradesignalpro.web.id/signals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[#00E676] text-xs font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                  LIVE
                </span>
              </div>
            </div>

            {/* Signal cards */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {previews.map((s, i) => (
                <div key={`${s.symbol}-${i}`} className={`relative p-4 rounded-xl border transition-all duration-500 ${
                  i === activeSignal
                    ? s.change >= 0
                      ? 'bg-[#00E676]/8 border-[#00E676]/50 shadow-[0_0_20px_rgba(0,230,118,0.15)] scale-[1.03]'
                      : 'bg-[#FF4757]/8 border-[#FF4757]/50 shadow-[0_0_20px_rgba(255,71,87,0.15)] scale-[1.03]'
                    : 'bg-white/2 border-white/6 hover:border-[#00D4FF]/15'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-white">{s.symbol}</span>
                      <span className="ml-1.5 text-[9px] text-[#4A6080] font-mono bg-white/5 px-1 py-0.5 rounded">{s.market}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${s.change >= 0 ? 'signal-buy' : 'signal-sell'}`}>
                      {s.change >= 0 ? 'NAIK' : 'TURUN'}
                    </span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-white">{s.price}</span>
                    <span className={`font-mono text-[10px] font-bold ${s.change >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                      {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-0.5 bg-white/5 rounded-full overflow-hidden mt-3">
                    <div className={`h-full rounded-full transition-all duration-700 ${s.change >= 0 ? 'bg-[#00E676]' : 'bg-[#FF4757]'}`}
                      style={{ width: `${Math.min(Math.abs(s.change) * 10, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-4 flex items-center justify-between">
              <p className="text-[#4A6080] text-[10px] font-mono">{isReal ? "Top movers hari ini — data real dari market" : "Memuat data market..."}</p>
              <Link href="/auth/register" className="text-[#00D4FF] text-xs font-semibold hover:underline">Akses Sinyal Real →</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
