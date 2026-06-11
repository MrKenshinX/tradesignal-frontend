'use client';
import { useSignals } from '@/hooks/useMarketData';
import { signalLabel, marketLabel } from '@/types';
import Link from 'next/link';
import { Zap, Shield, Target, Clock, Lock, ArrowRight } from 'lucide-react';

export function LiveSignalsPreview() {
  const { data: signals, isLoading } = useSignals();

  // Show first 6 signals — first 3 fully visible, last 3 blurred (premium lock)
  const preview = (signals || []).slice(0, 6);

  return (
    <section className="relative py-20 bg-[#060B18]" id="live-signals">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#00D4FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/25 text-[#00D4FF] text-xs font-semibold mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              Sinyal Live — Update Setiap 5 Menit
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
              Sinyal Trading Real-Time
            </h2>
            <p className="text-[#8BA8C2] text-sm mt-1">Preview 3 sinyal gratis · Login untuk akses penuh</p>
          </div>
          <Link href="/auth/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white whitespace-nowrap hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
            Akses Semua Sinyal <ArrowRight size={14} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <div className="text-center py-12 text-[#4A6080]">
            <Zap size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Sinyal sedang dimuat dari backend...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {preview.map((signal, i) => {
              const action = signalLabel(signal.signal_type);
              const market = marketLabel(signal.category);
              const isBuy = action === 'BUY';
              const isSell = action === 'SELL';
              const isLocked = i >= 3; // Lock signals 4, 5, 6
              const confidence = Number(signal.confidence ?? 0);

              return (
                <div key={signal.id}
                  className={`relative p-5 rounded-2xl transition-all duration-300 ${isLocked ? 'opacity-40' : ''}`}
                  style={{
                    background: 'rgba(6,11,24,0.7)',
                    border: isBuy ? '1px solid rgba(0,230,118,0.2)' : isSell ? '1px solid rgba(255,71,87,0.2)' : '1px solid rgba(255,215,0,0.2)',
                    backdropFilter: 'blur(12px)',
                  }}>

                  {/* Lock overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center z-10"
                      style={{ background: 'rgba(6,11,24,0.85)', backdropFilter: 'blur(4px)' }}>
                      <Lock size={20} className="text-[#7B2FFF] mb-2" />
                      <p className="text-white text-xs font-semibold mb-1">Sinyal Premium</p>
                      <Link href="/auth/register" className="text-[#00D4FF] text-[10px] hover:underline">Upgrade →</Link>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono font-black text-base text-white">{signal.symbol}</span>
                      <span className="ml-2 text-[9px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded border border-white/8">{market}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                      isBuy ? 'signal-buy' : isSell ? 'signal-sell' : 'signal-hold'
                    }`}>{action}</span>
                  </div>

                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-[#4A6080] text-[9px] uppercase tracking-wider mb-0.5">Entry Price</p>
                      <p className="font-mono font-black text-xl text-white">
                        {signal.price_entry != null ? Number(signal.price_entry).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4A6080] text-[9px] uppercase tracking-wider mb-0.5">Confidence</p>
                      <p className={`font-mono font-black text-xl ${confidence >= 80 ? 'text-[#00E676]' : confidence >= 60 ? 'text-[#FFD700]' : 'text-[#FF4757]'}`}>
                        {confidence > 0 ? `${confidence}%` : '—'}
                      </p>
                    </div>
                  </div>

                  {confidence > 0 && (
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${isBuy ? 'bg-[#00E676]' : isSell ? 'bg-[#FF4757]' : 'bg-[#FFD700]'}`}
                        style={{ width: `${confidence}%` }} />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2 rounded-xl" style={{ background: 'rgba(255,71,87,0.06)', border: '1px solid rgba(255,71,87,0.12)' }}>
                      <div className="flex items-center gap-1 mb-1">
                        <Shield size={9} className="text-[#FF4757]" />
                        <span className="text-[8px] text-[#FF4757] font-bold uppercase">Stop Loss</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
                        {signal.price_stop_loss != null ? Number(signal.price_stop_loss).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : '—'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl" style={{ background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.12)' }}>
                      <div className="flex items-center gap-1 mb-1">
                        <Target size={9} className="text-[#00E676]" />
                        <span className="text-[8px] text-[#00E676] font-bold uppercase">Take Profit</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-white">
                        {signal.price_target != null ? Number(signal.price_target).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="flex items-center gap-1 text-[#4A6080] text-[9px] font-mono">
                      <Clock size={9} />
                      {new Date(signal.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      <span className="ml-1 bg-white/5 px-1 rounded">{signal.timeframe}</span>
                    </span>
                    {signal.category === 'idn' && (
                      <a href="https://ajaib.onelink.me/SIjL/q0at7dq2" target="_blank" rel="noopener noreferrer"
                        className="text-[9px] text-[#00D4FF] hover:underline font-bold">Beli di Ajaib →</a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-8 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(123,47,255,0.06))', border: '1px solid rgba(0,212,255,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center shrink-0">
              <Lock size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">Akses Semua Sinyal Tanpa Batas</p>
              <p className="text-[#8BA8C2] text-xs">150+ instrumen · IDN, Asing & Crypto · Update setiap 5 menit</p>
            </div>
          </div>
          <Link href="/auth/register"
            className="px-6 py-2.5 rounded-xl text-white text-sm font-bold whitespace-nowrap hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #7B2FFF)' }}>
            Daftar Gratis →
          </Link>
        </div>
      </div>
    </section>
  );
}
