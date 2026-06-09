'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ArrowRight, TrendingUp, Shield, Clock } from 'lucide-react';
import { StarfieldCanvas } from './StarfieldCanvas';

const SIGNAL_PREVIEWS = [
  { symbol: 'BBCA', action: 'BUY', confidence: 87, market: 'IDN', price: '9.850', change: '+2.3%' },
  { symbol: 'BTC/USDT', action: 'BUY', confidence: 92, market: 'CRYPTO', price: '97,240', change: '+4.1%' },
  { symbol: 'AAPL', action: 'SELL', confidence: 74, market: 'ASING', price: '189.50', change: '-1.2%' },
  { symbol: 'TLKM', action: 'BUY', confidence: 81, market: 'IDN', price: '3.920', change: '+1.8%' },
  { symbol: 'ETH/USDT', action: 'BUY', confidence: 89, market: 'CRYPTO', price: '3.412', change: '+5.7%' },
];

export function HeroSection() {
  const [activeSignal, setActiveSignal] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % SIGNAL_PREVIEWS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const signal = SIGNAL_PREVIEWS[activeSignal];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#060B18]">
      {/* Starfield */}
      <StarfieldCanvas />

      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00D4FF]/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[#7B2FFF]/10 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-[#00E676]/6 blur-[80px] rounded-full pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-28 pb-16 text-center">

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
          Signal Engine LIVE — Update setiap 5 menit
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-blink" />
        </div>

        {/* Headline */}
        <h1 className={`max-w-5xl text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-[1.05] mb-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="block text-white">Sinyal Trading</span>
          <span className="block bg-gradient-to-r from-[#00D4FF] via-[#7B2FFF] to-[#00D4FF] bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
            Berbasis AI
          </span>
          <span className="block text-white text-3xl sm:text-4xl lg:text-5xl mt-2 font-semibold">untuk IDN, Saham & Crypto</span>
        </h1>

        <p className={`max-w-2xl text-[#8BA8C2] text-lg sm:text-xl leading-relaxed mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          RSI · MACD · Bollinger Bands · EMA · Stochastic. Auto Stop-Loss & Take-Profit berbasis ATR.
          Data real-time dari Yahoo Finance, Finnhub, dan Binance WebSocket.
        </p>

        {/* CTA */}
        <div className={`flex flex-col sm:flex-row items-center gap-4 mb-16 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link
            href="/auth/register"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-base shadow-glow-cyan hover:shadow-glow-purple transition-all duration-300 hover:scale-[1.02]"
          >
            <Zap size={18} fill="white" />
            Mulai Gratis Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-base hover:bg-white/10 hover:border-[#00D4FF]/30 transition-all duration-300"
          >
            Lihat Demo Dashboard
          </Link>
        </div>

        {/* Trust pills */}
        <div className={`flex flex-wrap items-center justify-center gap-3 mb-16 text-xs transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { icon: Shield, label: 'Data 100% Real — No Dummy' },
            { icon: Clock, label: 'Update Setiap 5 Menit' },
            { icon: TrendingUp, label: '150+ Instrumen Trading' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#8BA8C2]">
              <Icon size={12} className="text-[#00D4FF]" />
              {label}
            </div>
          ))}
        </div>

        {/* Live Signal Preview Card */}
        <div className={`w-full max-w-4xl transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-[#4A6080] text-xs font-mono uppercase tracking-widest mb-4">— Live Signal Feed Preview —</p>

          <div className="relative rounded-2xl overflow-hidden glass border border-[#00D4FF]/15 shadow-card">
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-[#0A1128]/60">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#FF4757]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#FFD700]/60" />
                  <span className="w-3 h-3 rounded-full bg-[#00E676]/60" />
                </div>
                <span className="font-mono text-xs text-[#4A6080]">tradesignalpro.web.id/signals</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#00E676] text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Signals grid */}
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {SIGNAL_PREVIEWS.map((s, i) => (
                <div
                  key={i}
                  className={`relative p-4 rounded-xl border transition-all duration-500 ${
                    i === activeSignal
                      ? s.action === 'BUY'
                        ? 'bg-[#00E676]/8 border-[#00E676]/40 shadow-glow-green scale-[1.02]'
                        : 'bg-[#FF4757]/8 border-[#FF4757]/40 shadow-glow-red scale-[1.02]'
                      : 'bg-white/3 border-white/8 hover:border-[#00D4FF]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono font-bold text-sm text-white">{s.symbol}</span>
                      <span className="ml-2 text-[10px] text-[#4A6080] font-mono bg-white/5 px-1.5 py-0.5 rounded">{s.market}</span>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                      s.action === 'BUY' ? 'signal-buy' : 'signal-sell'
                    }`}>
                      {s.action}
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="font-mono font-bold text-base text-white">{s.price}</span>
                      <span className={`ml-2 font-mono text-xs ${s.change.startsWith('+') ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>{s.change}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-[#4A6080] mb-0.5">Confidence</div>
                      <div className={`font-mono font-bold text-sm ${s.confidence >= 80 ? 'text-[#00E676]' : 'text-[#FFD700]'}`}>
                        {s.confidence}%
                      </div>
                    </div>
                  </div>
                  {/* Confidence bar */}
                  <div className="mt-2.5 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        s.action === 'BUY' ? 'bg-[#00E676]' : 'bg-[#FF4757]'
                      }`}
                      style={{ width: `${s.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 pb-4 flex items-center justify-between">
              <p className="text-[#4A6080] text-xs font-mono">Preview data ilustrasi — data real tersedia setelah login</p>
              <Link href="/auth/register" className="text-[#00D4FF] text-xs font-semibold hover:underline">
                Akses Sinyal Real →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
