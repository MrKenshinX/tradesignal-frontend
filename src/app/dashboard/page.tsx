'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { SignalCard } from '@/components/signals/SignalCard';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import WatchlistWidget from '@/components/dashboard/WatchlistWidget';
import { useSignals } from '@/hooks/useMarketData';
import { Zap, TrendingUp, BarChart2, RefreshCw } from 'lucide-react';
import { signalLabel } from '@/types';

function DashboardContent() {
  const { data: signals, isLoading, mutate } = useSignals();
  const [catFilter, setCatFilter] = useState<'all' | 'idn' | 'asing' | 'crypto'>('all');
  const [actFilter, setActFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filtered = (signals || []).filter((s) => {
    if (catFilter !== 'all' && s.category !== catFilter) return false;
    if (actFilter !== 'ALL' && signalLabel(s.signal_type) !== actFilter) return false;
    return true;
  });

  const buyCount = signals?.filter(s => signalLabel(s.signal_type) === 'BUY').length ?? 0;
  const sellCount = signals?.filter(s => signalLabel(s.signal_type) === 'SELL').length ?? 0;
  const avgConf = signals?.length
    ? Math.round(signals.reduce((a, s) => a + (s.confidence ?? 0), 0) / signals.length)
    : 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#060B18]">
        <div className="pt-16">
          <div className="border-b border-white/5" style={{ background: 'rgba(10,17,40,0.6)', backdropFilter: 'blur(12px)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
                    <Zap size={20} className="text-[#00D4FF]" /> Dashboard
                  </h1>
                  <p className="text-[#4A6080] text-xs mt-0.5">Sinyal real-time · Update setiap 5 menit</p>
                </div>
                <button onClick={() => mutate()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[#8BA8C2] hover:text-white text-xs transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Sinyal', value: signals?.length ?? '—', icon: Zap, color: '#00D4FF' },
                { label: 'BUY', value: buyCount || '—', icon: TrendingUp, color: '#00E676' },
                { label: 'SELL', value: sellCount || '—', icon: BarChart2, color: '#FF4757' },
                { label: 'Avg Confidence', value: avgConf ? `${avgConf}%` : '—', icon: Zap, color: '#FFD700' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="p-4 rounded-xl" style={{ background: 'rgba(10,17,40,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon size={12} style={{ color: stat.color }} />
                      <span className="text-[#4A6080] text-[11px]">{stat.label}</span>
                    </div>
                    <span className="font-mono font-black text-xl" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                );
              })}
            </div>

            <MarketOverview />

            <div className="mt-6">
              <WatchlistWidget />
            </div>

            {/* Signals */}
            <div className="mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap size={16} className="text-[#00D4FF]" /> Sinyal Trading
                </h2>
                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['all','idn','asing','crypto'] as const).map(t => (
                      <button key={t} onClick={() => setCatFilter(t)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase transition-all ${
                          catFilter === t ? 'bg-[#00D4FF] text-[#060B18]' : 'text-[#8BA8C2] hover:text-white'
                        }`}>{t}</button>
                    ))}
                  </div>
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {(['ALL','BUY','SELL'] as const).map(a => (
                      <button key={a} onClick={() => setActFilter(a)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                          actFilter === a
                            ? a === 'BUY' ? 'bg-[#00E676] text-[#060B18]'
                            : a === 'SELL' ? 'bg-[#FF4757] text-white'
                            : 'bg-[#00D4FF] text-[#060B18]'
                            : 'text-[#8BA8C2] hover:text-white'
                        }`}>{a}</button>
                    ))}
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-[#4A6080]">
                  <Zap size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Tidak ada sinyal untuk filter ini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((signal) => <SignalCard key={signal.id} signal={signal} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default function DashboardPage() {
  return (
    <SWRProvider>
      <Navbar />
      <DashboardContent />
      <Footer />
    </SWRProvider>
  );
}
