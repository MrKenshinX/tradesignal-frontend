'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MarketOverview } from '@/components/dashboard/MarketOverview';
import WatchlistWidget from '@/components/dashboard/WatchlistWidget';
import { TrackRecordWidget } from '@/components/dashboard/TrackRecordWidget';
import { useSignals } from '@/hooks/useMarketData';
import { Zap, TrendingUp, BarChart2, RefreshCw } from 'lucide-react';
import { signalLabel } from '@/types';

function DashboardContent() {
  const { data: signals, isLoading, mutate } = useSignals();

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

            {/* Track Record — menggantikan daftar sinyal (ada di halaman /signals) */}
            <div className="mt-6">
              <TrackRecordWidget />
            </div>

            {/* Link ke halaman sinyal lengkap */}
            <div className="mt-6 text-center">
              <a href="/signals"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] font-bold text-sm hover:bg-[#00D4FF]/20 transition-all">
                <Zap size={16} /> Lihat Semua Sinyal Trading →
              </a>
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
