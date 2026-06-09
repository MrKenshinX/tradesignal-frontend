'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { SignalCard } from '@/components/signals/SignalCard';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import { useSignals } from '@/hooks/useMarketData';
import { Zap, TrendingUp, BarChart2, RefreshCw } from 'lucide-react';
import { signalLabel } from '@/types';

function DashboardContent() {
  const { data: signals, isLoading, mutate } = useSignals();
  const [catFilter, setCatFilter] = useState<'all' | 'idn' | 'asing' | 'crypto'>('all');
  const [actFilter, setActFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');

  const filtered = (signals || []).filter((s) => {
    if (catFilter !== 'all' && s.category !== catFilter) return false;
    if (actFilter !== 'ALL') {
      const lbl = signalLabel(s.signal_type);
      if (lbl !== actFilter) return false;
    }
    return true;
  });

  const buyCount = signals?.filter(s => signalLabel(s.signal_type) === 'BUY').length ?? 0;
  const sellCount = signals?.filter(s => signalLabel(s.signal_type) === 'SELL').length ?? 0;
  const avgConf = signals?.length
    ? Math.round(signals.reduce((a, s) => a + (s.confidence ?? 0), 0) / signals.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#060B18]">
      <div className="pt-16">
        <div className="border-b border-white/5 bg-[#0A1128]/60 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                  <Zap size={22} className="text-[#00D4FF]" /> Dashboard
                </h1>
                <p className="text-[#8BA8C2] text-sm mt-1">Sinyal real-time · Update setiap 5 menit</p>
              </div>
              <button onClick={() => mutate()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white hover:border-[#00D4FF]/30 text-sm transition-all">
                <RefreshCw size={14} /> Refresh Data
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Sinyal', value: signals?.length ?? '—', icon: Zap, color: 'text-[#00D4FF]' },
              { label: 'BUY', value: buyCount || '—', icon: TrendingUp, color: 'text-[#00E676]' },
              { label: 'SELL', value: sellCount || '—', icon: BarChart2, color: 'text-[#FF4757]' },
              { label: 'Avg Confidence', value: avgConf ? `${avgConf}%` : '—', icon: Zap, color: 'text-[#FFD700]' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 rounded-xl glass border border-white/8">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={14} className={stat.color} />
                    <span className="text-[#8BA8C2] text-xs">{stat.label}</span>
                  </div>
                  <span className={`font-mono font-bold text-xl ${stat.color}`}>{stat.value}</span>
                </div>
              );
            })}
          </div>

          <MarketOverview />

          {/* Signals */}
          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap size={18} className="text-[#00D4FF]" /> Sinyal Trading
              </h2>
              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                  {(['all','idn','asing','crypto'] as const).map(t => (
                    <button key={t} onClick={() => setCatFilter(t)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all uppercase ${
                        catFilter === t ? 'bg-[#00D4FF] text-[#060B18]' : 'text-[#8BA8C2] hover:text-white'
                      }`}>
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                  {(['ALL','BUY','SELL'] as const).map(a => (
                    <button key={a} onClick={() => setActFilter(a)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                        actFilter === a
                          ? a === 'BUY' ? 'bg-[#00E676] text-[#060B18]'
                          : a === 'SELL' ? 'bg-[#FF4757] text-white'
                          : 'bg-[#00D4FF] text-[#060B18]'
                          : 'text-[#8BA8C2] hover:text-white'
                      }`}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-52 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-[#4A6080]">
                <Zap size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tidak ada sinyal untuk filter ini saat ini</p>
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
