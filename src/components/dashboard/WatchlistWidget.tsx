'use client';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useMarketIDN, useMarketAsing, useMarketCrypto } from '@/hooks/useMarketData';

export default function WatchlistWidget() {
  const { items, toggle, isLoading } = useWatchlist();
  const { data: idn } = useMarketIDN();
  const { data: asing } = useMarketAsing();
  const { data: crypto } = useMarketCrypto();

  const allMarket = [...(idn ?? []), ...(asing ?? []), ...(crypto ?? [])];
  const priceOf = (symbol: string) => allMarket.find(m => m.symbol === symbol);

  return (
    <div className="rounded-2xl glass border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Star size={15} className="text-[#FFD700]" /> Watchlist
        </h3>
        <span className="text-[#4A6080] text-xs font-mono">{items.length} simbol</span>
      </div>

      {isLoading ? (
        <div className="px-5 py-8 space-y-3">
          {[0, 1, 2].map(i => <div key={i} className="h-8 rounded-lg bg-white/3 animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <p className="text-[#8BA8C2] text-xs">Belum ada simbol favorit.</p>
          <Link href="/screener" className="text-[#00D4FF] text-xs hover:underline mt-1 inline-block">
            Tambahkan dari Screener →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/3">
          {items.map((w) => {
            const m = priceOf(w.symbol);
            const chg = Number(m?.change_pct ?? 0);
            return (
              <div key={w.symbol} className="flex items-center justify-between px-5 py-3 hover:bg-white/3 transition-colors">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(w.symbol, w.category)} aria-label="Hapus dari watchlist">
                    <Star size={14} className="text-[#FFD700] fill-[#FFD700] hover:opacity-60 transition-opacity" />
                  </button>
                  <div>
                    <p className="text-white text-sm font-mono font-bold">{w.symbol}</p>
                    <p className="text-[#4A6080] text-[10px] uppercase font-mono">{w.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-mono">
                    {m?.price != null ? Number(m.price).toLocaleString('id-ID', { maximumFractionDigits: 2 }) : '—'}
                  </p>
                  {m && (
                    <p className={`text-[11px] font-mono flex items-center justify-end gap-0.5 ${
                      chg >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                      {chg >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {chg >= 0 ? '+' : ''}{chg.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
