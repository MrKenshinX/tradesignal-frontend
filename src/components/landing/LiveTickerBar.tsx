'use client';
import { useMarketIDN, useMarketCrypto } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function LiveTickerBar() {
  const { data: idn } = useMarketIDN();
  const { data: crypto } = useMarketCrypto();

  const items = [
    ...(idn?.slice(0, 8) || []),
    ...(crypto?.slice(0, 6) || []),
  ];

  if (items.length === 0) return (
    <div className="bg-[#0A1128] border-y border-[#00D4FF]/10 h-9 flex items-center px-4">
      <div className="flex gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-4 w-24 bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );

  const doubled = [...items, ...items];

  return (
    <div className="bg-[#0A1128]/80 backdrop-blur-sm border-y border-[#00D4FF]/10 h-9 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0A1128] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0A1128] to-transparent z-10" />

      <div className="flex items-center h-full animate-ticker whitespace-nowrap">
        {doubled.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 px-5 border-r border-white/5 h-full">
            <span className="font-mono text-xs font-semibold text-white/80">{item.symbol}</span>
            <span className={`font-mono text-xs font-bold ${(item.change_pct ?? 0) >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
              {item.price?.toLocaleString('id-ID', { maximumFractionDigits: 2 })}
            </span>
            <span className={`flex items-center gap-0.5 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
              (item.change_pct ?? 0) >= 0
                ? 'text-[#00E676] bg-[#00E676]/10'
                : 'text-[#FF4757] bg-[#FF4757]/10'
            }`}>
              {(item.change_pct ?? 0) >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {Math.abs(item.change_pct ?? 0).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
