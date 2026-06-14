'use client';
import useSWR from 'swr';
import { fetchers } from '@/lib/api';
import { TrackRecordStats, SignalResult, marketLabel } from '@/types';
import { TrendingUp, TrendingDown, Award, Clock, CheckCircle2, XCircle } from 'lucide-react';

export function TrackRecordWidget() {
  const { data: stats } = useSWR<TrackRecordStats | null>('track-record/stats', fetchers.trackRecordStats, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 1000,
  });
  const { data: recent } = useSWR<SignalResult[]>('track-record/recent', fetchers.trackRecordRecent, {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 1000,
  });

  const totalClosed = stats?.total_closed ?? 0;
  const winRate = stats?.win_rate;

  return (
    <div className="rounded-2xl glass border border-white/8 p-5" style={{ background: 'rgba(10,17,40,0.6)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Award size={18} className="text-[#FFD700]" />
        <h2 className="text-base font-bold text-white">Track Record Sinyal</h2>
      </div>

      {/* Statistik utama */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
          <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Win Rate</p>
          <p className="font-mono font-black text-2xl text-[#00E676]">
            {winRate != null ? `${winRate}%` : '—'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
          <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Sinyal Selesai</p>
          <p className="font-mono font-black text-2xl text-white">{totalClosed}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#00E676]/6 border border-[#00E676]/12">
          <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Win</p>
          <p className="font-mono font-black text-2xl text-[#00E676]">{stats?.wins ?? 0}</p>
        </div>
        <div className="p-3 rounded-xl bg-[#FF4757]/6 border border-[#FF4757]/12">
          <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Loss</p>
          <p className="font-mono font-black text-2xl text-[#FF4757]">{stats?.losses ?? 0}</p>
        </div>
      </div>

      {/* Status data terkumpul */}
      {totalClosed < 10 && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#00D4FF]/6 border border-[#00D4FF]/15 mb-4">
          <Clock size={14} className="text-[#00D4FF] shrink-0" />
          <p className="text-[#8BA8C2] text-xs">
            Track record sedang terkumpul. {stats?.pending ?? 0} sinyal masih berjalan — hasilnya akan tercatat otomatis saat menyentuh target atau stop-loss.
          </p>
        </div>
      )}

      {/* Riwayat hasil terbaru */}
      {recent && recent.length > 0 ? (
        <div>
          <p className="text-[#4A6080] text-[11px] uppercase tracking-wider mb-2">Hasil Terbaru</p>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
            {recent.map((r) => {
              const isWin = r.result === 'win';
              const ret = r.actual_return != null ? Number(r.actual_return) : null;
              return (
                <div key={r.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/3 border border-white/5">
                  <div className="flex items-center gap-2">
                    {isWin ? <CheckCircle2 size={15} className="text-[#00E676]" /> : <XCircle size={15} className="text-[#FF4757]" />}
                    <span className="font-mono font-bold text-sm text-white">{r.symbol}</span>
                    <span className="text-[8px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded">{marketLabel(r.category)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {ret != null && (
                      <span className={`font-mono text-xs font-bold flex items-center gap-1 ${ret >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                        {ret >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
                      </span>
                    )}
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isWin ? 'bg-[#00E676]/15 text-[#00E676]' : 'bg-[#FF4757]/15 text-[#FF4757]'}`}>
                      {isWin ? 'WIN' : 'LOSS'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-[#4A6080] text-xs text-center py-4">
          Belum ada sinyal yang selesai. Hasil akan muncul seiring waktu.
        </p>
      )}

      <p className="text-[#4A6080] text-[10px] text-center mt-4 pt-3 border-t border-white/5">
        Hasil dihitung otomatis saat harga menyentuh target (win) atau stop-loss (loss). Kinerja masa lalu tidak menjamin hasil di masa depan.
      </p>
    </div>
  );
}
