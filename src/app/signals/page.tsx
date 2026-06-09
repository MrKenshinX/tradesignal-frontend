'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { SignalCard } from '@/components/signals/SignalCard';
import { useSignals } from '@/hooks/useMarketData';
import { Zap, RefreshCw, Search } from 'lucide-react';
import { signalLabel } from '@/types';

function SignalsContent() {
  const { data: signals, isLoading, mutate } = useSignals();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState<'all' | 'idn' | 'asing' | 'crypto'>('all');
  const [action, setAction] = useState<'ALL' | 'BUY' | 'SELL' | 'HOLD'>('ALL');
  const [minConf, setMinConf] = useState(0);
  const [sort, setSort] = useState<'confidence' | 'updated_at' | 'score'>('confidence');

  const filtered = (signals || [])
    .filter(s => {
      if (cat !== 'all' && s.category !== cat) return false;
      if (action !== 'ALL' && signalLabel(s.signal_type) !== action) return false;
      if ((s.confidence ?? 0) < minConf) return false;
      if (search && !s.symbol.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'confidence') return (b.confidence ?? 0) - (a.confidence ?? 0);
      if (sort === 'score') return (b.score ?? 0) - (a.score ?? 0);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

  return (
    <div className="min-h-screen bg-[#060B18] pt-16">
      <div className="border-b border-white/5 bg-[#0A1128]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Zap size={22} className="text-[#00D4FF]" /> Sinyal Trading
              </h1>
              <p className="text-[#8BA8C2] text-sm mt-1">
                {signals?.length ?? 0} sinyal aktif · Update setiap 5 menit
              </p>
            </div>
            <button onClick={() => mutate()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white text-sm transition-all">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl glass border border-white/8">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6080]" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari simbol..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00D4FF]/40 transition-all" />
          </div>

          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['all','idn','asing','crypto'] as const).map(t => (
              <button key={t} onClick={() => setCat(t)}
                className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-all ${cat === t ? 'bg-[#00D4FF] text-[#060B18]' : 'text-[#8BA8C2] hover:text-white'}`}>
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['ALL','BUY','SELL','HOLD'] as const).map(a => (
              <button key={a} onClick={() => setAction(a)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  action === a
                    ? a === 'BUY' ? 'bg-[#00E676] text-[#060B18]'
                    : a === 'SELL' ? 'bg-[#FF4757] text-white'
                    : a === 'HOLD' ? 'bg-[#FFD700] text-[#060B18]'
                    : 'bg-[#00D4FF] text-[#060B18]'
                    : 'text-[#8BA8C2] hover:text-white'
                }`}>
                {a}
              </button>
            ))}
          </div>

          <select value={sort} onChange={e => setSort(e.target.value as any)}
            className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#00D4FF]/40">
            <option value="confidence" className="bg-[#0A1128]">Sort: Confidence</option>
            <option value="score" className="bg-[#0A1128]">Sort: Score</option>
            <option value="updated_at" className="bg-[#0A1128]">Sort: Terbaru</option>
          </select>

          <div className="flex items-center gap-2">
            <span className="text-[#8BA8C2] text-xs">Min conf:</span>
            <input type="range" min={0} max={90} step={5} value={minConf}
              onChange={e => setMinConf(Number(e.target.value))} className="w-20 accent-[#00D4FF]" />
            <span className="font-mono text-xs text-[#00D4FF] w-8">{minConf}%</span>
          </div>
        </div>

        <div className="mb-4 text-[#4A6080] text-xs font-mono">{filtered.length} sinyal ditemukan</div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#4A6080]">
            <Zap size={40} className="mx-auto mb-4 opacity-20" />
            <p>Tidak ada sinyal yang cocok dengan filter kamu</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => <SignalCard key={s.id} signal={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignalsPage() {
  return (
    <SWRProvider>
      <Navbar />
      <SignalsContent />
      <Footer />
    </SWRProvider>
  );
}
