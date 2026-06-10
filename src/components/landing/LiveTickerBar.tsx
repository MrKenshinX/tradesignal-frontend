'use client';
import { useMarketIDN, useMarketCrypto } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function LiveTickerBar() {
  const { data: idn } = useMarketIDN();
  const { data: crypto } = useMarketCrypto();

  const items = [
    ...(idn?.slice(0, 10) || []),
    ...(crypto?.slice(0, 8) || []),
  ];

  if (items.length === 0) return (
    <div className="bg-[#0A1128]/60 border-b border-[#00D4FF]/8 h-8 flex items-center px-4 overflow-hidden">
      <div className="flex gap-6 animate-pulse">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-3 w-20 bg-white/5 rounded" />
        ))}
      </div>
    </div>
  );

  const doubled = [...items, ...items];

  return (
    <div className="relative bg-[#060B18]/80 border-b border-white/5 h-8 overflow-hidden"
      style={{ backdropFilter: 'blur(10px)' }}>
      {/* Label */}
      <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center px-3 bg-gradient-to-r from-[#060B18] via-[#060B18] to-transparent pr-8">
        <div className="flex items-center gap-1.5 text-[#00D4FF] text-[9px] font-mono font-bold uppercase tracking-widest">
          <Activity size={9} className="animate-pulse" />
          Live
        </div>
      </div>

      {/* Fade edges */}
      <div className="absolute left-16 top-0 bottom-0 w-8 bg-gradient-to-r from-[#060B18] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#060B18] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center h-full animate-ticker pl-24 whitespace-nowrap">
        {doubled.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-4 border-r border-white/5 h-full">
            <span className="font-mono text-[11px] font-bold text-white/70">{item.symbol}</span>
            <span className={`font-mono text-[11px] font-bold ${(item.change_pct ?? 0) >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
              {item.price?.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center gap-0.5 text-[9px] font-mono font-bold px-1 py-0.5 rounded ${
              (item.change_pct ?? 0) >= 0
                ? 'text-[#00E676] bg-[#00E676]/10'
                : 'text-[#FF4757] bg-[#FF4757]/10'
            }`}>
              {(item.change_pct ?? 0) >= 0 ? <TrendingUp size={7} /> : <TrendingDown size={7} />}
              {Math.abs(item.change_pct ?? 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
