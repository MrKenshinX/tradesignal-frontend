'use client';
import { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useMarketIDN, useMarketCrypto, useMarketAsing } from '@/hooks/useMarketData';
import { Search, SlidersHorizontal, TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketData } from '@/types';

type Row = MarketData & { category: 'idn' | 'asing' | 'crypto' };

function ScreenerContent() {
  const { data: idn, isLoading: idnL } = useMarketIDN();
  const { data: crypto, isLoading: cryptoL } = useMarketCrypto();
  const { data: asing, isLoading: asingL } = useMarketAsing();

  const [cat, setCat] = useState<'all' | 'idn' | 'asing' | 'crypto'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'change_pct' | 'price'>('change_pct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [minChange, setMinChange] = useState<number>(-100);
  const [maxChange, setMaxChange] = useState<number>(100);

  const allData = useMemo<Row[]>(() => {
    const merged: Row[] = [
      ...(idn ?? []).map(d => ({ ...d, category: 'idn' as const })),
      ...(asing ?? []).map(d => ({ ...d, category: 'asing' as const })),
      ...(crypto ?? []).map(d => ({ ...d, category: 'crypto' as const })),
    ];
    return merged
      .filter(d => {
        if (cat !== 'all' && d.category !== cat) return false;
        if (search && !d.symbol.toLowerCase().includes(search.toLowerCase())) return false;
        const cp = d.change_pct ?? 0;
        if (cp < minChange || cp > maxChange) return false;
        return true;
      })
      .sort((a, b) => {
        const av = (a[sortBy] ?? 0) as number;
        const bv = (b[sortBy] ?? 0) as number;
        return sortDir === 'desc' ? bv - av : av - bv;
      });
  }, [idn, asing, crypto, cat, search, sortBy, sortDir, minChange, maxChange]);

  const isLoading = idnL || cryptoL || asingL;

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  return (
    <div className="min-h-screen bg-[#060B18] pt-16">
      <div className="border-b border-white/5 bg-[#0A1128]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <SlidersHorizontal size={22} className="text-[#00E676]" /> Screener
          </h1>
          <p className="text-[#8BA8C2] text-sm mt-1">{allData.length} instrumen · Filter & sort real-time</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-6 p-4 rounded-2xl glass border border-white/8">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6080]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari simbol..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00E676]/40 transition-all" />
          </div>
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['all','idn','asing','crypto'] as const).map(m => (
              <button key={m} onClick={() => setCat(m)}
                className={`px-3 py-1 rounded-md text-xs font-semibold uppercase transition-all ${cat === m ? 'bg-[#00E676] text-[#060B18]' : 'text-[#8BA8C2] hover:text-white'}`}>
                {m}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#8BA8C2]">
            <span>Change%:</span>
            <input type="number" value={minChange} onChange={e => setMinChange(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none" />
            <span>~</span>
            <input type="number" value={maxChange} onChange={e => setMaxChange(Number(e.target.value))}
              className="w-16 px-2 py-1 rounded bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none" />
          </div>
        </div>

        <div className="rounded-2xl glass border border-white/8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-[#0A1128]/40">
                  <th className="px-5 py-3 text-left text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-center text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">Market</th>
                  <th className="px-4 py-3 text-right text-[10px] font-mono text-[#4A6080] uppercase cursor-pointer hover:text-white"
                    onClick={() => toggleSort('price')}>
                    Harga {sortBy === 'price' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-mono text-[#4A6080] uppercase cursor-pointer hover:text-white"
                    onClick={() => toggleSort('change_pct')}>
                    24h % {sortBy === 'change_pct' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/3">
                        {[1,2,3,4].map(j => (
                          <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  : allData.map((d, i) => (
                      <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                        <td className="px-5 py-3">
                          <span className="font-mono font-bold text-sm text-white">{d.symbol}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-[10px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded uppercase">{d.category}</span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-sm text-white">
                          {d.price != null ? Number(d.price).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : '—'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {d.change_pct != null ? (
                            <span className={`flex items-center justify-end gap-1 font-mono text-xs font-bold ${d.change_pct >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                              {d.change_pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                              {Number(d.change_pct ?? 0) >= 0 ? "+" : ""}{Number(d.change_pct ?? 0).toFixed(2)}%
                            </span>
                          ) : <span className="text-[#4A6080] font-mono text-xs">—</span>}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
            {!isLoading && allData.length === 0 && (
              <div className="text-center py-12 text-[#4A6080] text-sm">Tidak ada instrumen dengan filter ini</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScreenerPage() {
  return (
    <SWRProvider>
      <Navbar />
      <ScreenerContent />
      <Footer />
    </SWRProvider>
  );
}
