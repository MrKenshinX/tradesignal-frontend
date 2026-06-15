'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { gameAPI } from '@/lib/api';
import { Gamepad2, Wallet, TrendingUp, Trophy, ArrowRight, Zap, Loader2 } from 'lucide-react';

interface Business {
  id: string; name: string; emoji: string;
  income: number; count: number; nextCost: number; incomeTotal: number;
}
interface GameState {
  cash: number; incomePerSecond: number; netWorth: number; totalEarned: number;
  businesses: Business[]; offlineCapHours: number;
}

const RANKS = [
  { min: 0, label: 'Trader Buntung', emoji: '😅', color: '#FF4757' },
  { min: 5000, label: 'Pemula', emoji: '🌱', color: '#8BA8C2' },
  { min: 100000, label: 'Pebisnis', emoji: '📈', color: '#00D4FF' },
  { min: 5000000, label: 'Sultan', emoji: '💰', color: '#FFD700' },
  { min: 100000000, label: 'Konglomerat', emoji: '🦁', color: '#7B2FFF' },
  { min: 5000000000, label: 'Dewa Bisnis', emoji: '👑', color: '#00E676' },
];
function getRank(nw: number) {
  let r = RANKS[0];
  for (const x of RANKS) if (nw >= x.min) r = x;
  return r;
}
const fmt = (n: number, dec = 0) =>
  isFinite(n) ? n.toLocaleString('id-ID', { maximumFractionDigits: dec, minimumFractionDigits: 0 }) : '—';

function GameContent() {
  const [state, setState] = useState<GameState | null>(null);
  const [displayCash, setDisplayCash] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [error, setError] = useState('');

  const stateRef = useRef<GameState | null>(null);
  stateRef.current = state;
  const displayRef = useRef(0);
  displayRef.current = displayCash;

  const sync = useCallback(async () => {
    try {
      const s = await gameAPI.getState();
      setState(s);
      setDisplayCash(s.cash);
      setError('');
    } catch (e: any) {
      setError('Gagal memuat game. Pastikan kamu sudah login.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Muat awal + sinkron berkala tiap 12 detik (koreksi drift dari server)
  useEffect(() => {
    sync();
    const id = setInterval(sync, 12000);
    return () => clearInterval(id);
  }, [sync]);

  // Animasi cash bertambah halus di klien (sumber kebenaran tetap server)
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s && s.incomePerSecond > 0) {
        setDisplayCash(prev => prev + s.incomePerSecond / 10);
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  const buy = async (id: string) => {
    if (buying) return;
    setBuying(id);
    try {
      const s = await gameAPI.getState(); // refresh dulu
      const biz = s.businesses.find((b: Business) => b.id === id);
      if (biz && displayRef.current < biz.nextCost) {
        setError('Uang belum cukup!');
        setBuying(null);
        setTimeout(() => setError(''), 1500);
        return;
      }
      const ns = await gameAPI.buyBusiness(id);
      setState(ns);
      setDisplayCash(ns.cash);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Gagal membeli.');
      setTimeout(() => setError(''), 1500);
    } finally {
      setBuying(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060B18] pt-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00D4FF]" size={32} />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-[#060B18] pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white mb-4">{error || 'Gagal memuat game.'}</p>
          <button onClick={sync} className="px-5 py-2.5 rounded-xl bg-[#00D4FF] text-[#060B18] font-bold">Coba Lagi</button>
        </div>
      </div>
    );
  }

  const rank = getRank(displayCash);

  return (
    <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 text-[#7B2FFF] text-xs font-semibold mb-3">
            <Gamepad2 size={12} /> Trader Tycoon
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">Kerajaan Bisnis</h1>
          <p className="text-[#8BA8C2] text-sm">Bangun usaha, kumpulkan income pasif, jadi konglomerat. Progress tersimpan di server.</p>
        </div>

        {/* Panel utama */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="p-4 rounded-2xl glass border border-white/8 col-span-2">
            <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet size={11} /> Uang</p>
            <p className="font-mono font-black text-2xl text-white">Rp {fmt(displayCash)}</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-white/8">
            <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1"><TrendingUp size={11} /> Per Detik</p>
            <p className="font-mono font-bold text-lg text-[#00E676]">+{fmt(state.incomePerSecond)}</p>
          </div>
          <div className="p-4 rounded-2xl glass border border-white/8">
            <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1"><Trophy size={11} /> Rank</p>
            <p className="font-bold text-base" style={{ color: rank.color }}>{rank.emoji} {rank.label}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757] text-sm text-center">{error}</div>
        )}

        {/* Daftar usaha */}
        <div className="space-y-2.5">
          {state.businesses.map(b => {
            const affordable = displayCash >= b.nextCost;
            const owned = b.count > 0;
            return (
              <div key={b.id} className={`flex items-center gap-3 p-4 rounded-2xl glass border transition-all ${owned ? 'border-white/10' : 'border-white/5 opacity-90'}`}>
                <div className="text-3xl shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5">{b.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm">{b.name}</p>
                    {b.count > 0 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">×{fmt(b.count)}</span>}
                  </div>
                  <p className="text-[#4A6080] text-[11px] mt-0.5">
                    +Rp {fmt(b.income)}/dtk per unit
                    {b.incomeTotal > 0 && <span className="text-[#00E676]"> · total +Rp {fmt(b.incomeTotal)}/dtk</span>}
                  </p>
                </div>
                <button onClick={() => buy(b.id)} disabled={!affordable || buying === b.id}
                  className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1 ${
                    affordable ? 'bg-[#00E676] text-[#060B18] hover:opacity-90' : 'bg-white/5 text-[#4A6080] cursor-not-allowed'
                  }`}>
                  {buying === b.id ? <Loader2 size={13} className="animate-spin" /> : <>Beli<br/></>}
                  <span className="font-mono">Rp {fmt(b.nextCost)}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Info + CTA */}
        <div className="mt-6 p-4 rounded-2xl glass border border-white/8 text-center">
          <p className="text-[#4A6080] text-[11px]">
            💾 Progress otomatis tersimpan. Income tetap berjalan saat offline (maks {state.offlineCapHours} jam).
            Total penghasilan seumur hidup: Rp {fmt(state.totalEarned)}.
          </p>
        </div>

        <div className="mt-4 p-5 rounded-2xl glass border border-[#00D4FF]/20 text-center">
          <p className="text-[#8BA8C2] text-xs mb-3">🎮 Game simulasi untuk hiburan & edukasi. Bukan trading/investasi nyata.</p>
          <p className="text-white text-sm font-bold mb-3">Mau trading sungguhan dengan analisa asli?</p>
          <a href="/signals" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
            <Zap size={14} fill="white" /> Lihat Sinyal Trading Asli <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <>
      <Navbar />
      <AuthGuard>
        <GameContent />
      </AuthGuard>
      <Footer />
    </>
  );
}
