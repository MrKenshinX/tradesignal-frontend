'use client';
import { useMarketIDN, useMarketCrypto, useMarketAsing } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';
import type { MarketData } from '@/types';

type Tab = 'idn' | 'crypto' | 'asing';

export function MarketOverview() {
  const [tab, setTab] = useState<Tab>('idn');
  const { data: idn, isLoading: idnLoad } = useMarketIDN();
  const { data: crypto, isLoading: cryptoLoad } = useMarketCrypto();
  const { data: asing, isLoading: asingLoad } = useMarketAsing();

  const dataMap: Record<Tab, MarketData[] | undefined> = { idn, crypto, asing };
  const loadMap: Record<Tab, boolean> = { idn: idnLoad, crypto: cryptoLoad, asing: asingLoad };
  const data = dataMap[tab];
  const isLoading = loadMap[tab];

  const tabLabels: Record<Tab, string> = { idn: 'IDN', crypto: 'Crypto', asing: 'Asing' };

  return (
    <div className="rounded-2xl glass border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Market Overview</h3>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {(Object.keys(tabLabels) as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                tab === t ? 'bg-[#00D4FF] text-[#060B18]' : 'text-[#8BA8C2] hover:text-white'
              }`}>
              {tabLabels[t]}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left px-5 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">Symbol</th>
              <th className="text-right px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">Harga</th>
              <th className="text-right px-5 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">24h %</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/3">
                    {[1,2,3].map(j => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-white/5 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              : (data || []).slice(0, 12).map((item, i) => (
                  <tr key={i} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-mono font-semibold text-sm text-white">{item.symbol}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-sm text-white">
                      {item.price != null
                        ? item.price.toLocaleString('id-ID', { maximumFractionDigits: 4 })
                        : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {item.change_pct != null ? (
                        <span className={`flex items-center justify-end gap-1 font-mono text-xs font-semibold ${
                          item.change_pct >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'
                        }`}>
                          {item.change_pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {item.change_pct >= 0 ? '+' : ''}{item.change_pct.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-[#4A6080] font-mono text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>

        {!isLoading && (!data || data.length === 0) && (
          <div className="text-center py-10 text-[#4A6080] text-sm">
            <p className="text-xs">Menunggu data dari backend...</p>
          </div>
        )}
      </div>
    </div>
  );
}
