'use client';
import useSWR from 'swr';
import { fetchers } from '@/lib/api';
import { NewsItem } from '@/types';
import { Newspaper, ExternalLink, Clock } from 'lucide-react';

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  return `${days}h lalu`;
}

export function NewsWidget() {
  const { data: news, isLoading } = useSWR<NewsItem[]>('news', fetchers.news, {
    revalidateOnFocus: false,
    refreshInterval: 15 * 60 * 1000,
  });

  return (
    <div className="rounded-2xl glass border border-white/8 p-5" style={{ background: 'rgba(10,17,40,0.6)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Newspaper size={18} className="text-[#00D4FF]" />
        <h2 className="text-base font-bold text-white">Berita Pasar</h2>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      ) : !news || news.length === 0 ? (
        <p className="text-[#4A6080] text-sm text-center py-6">Belum ada berita tersedia.</p>
      ) : (
        <div className="space-y-2 max-h-[420px] overflow-y-auto">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-[#00D4FF]/30 transition-colors group"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="w-16 h-16 rounded-lg object-cover shrink-0 bg-white/5"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold leading-snug line-clamp-2 group-hover:text-[#00D4FF] transition-colors">
                  {item.headline}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[#4A6080] text-[10px]">
                  <span className="font-medium">{item.source}</span>
                  <span className="flex items-center gap-0.5"><Clock size={9} /> {timeAgo(item.datetime)}</span>
                  {item.category === 'crypto' && (
                    <span className="px-1.5 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">CRYPTO</span>
                  )}
                  <ExternalLink size={9} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      <p className="text-[#4A6080] text-[10px] text-center mt-3 pt-3 border-t border-white/5">
        Sumber: Finnhub · Berita pihak ketiga, bukan rekomendasi dari TradeSignal Pro
      </p>
    </div>
  );
}
