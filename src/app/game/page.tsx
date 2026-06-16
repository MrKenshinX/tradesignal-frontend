'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { gameAPI } from '@/lib/api';
import { Gamepad2, Wallet, TrendingUp, Trophy, ArrowRight, Zap, Loader2, Landmark, Lock, Building2, Medal, Briefcase, LineChart } from 'lucide-react';

interface Business {
  id: string; name: string; emoji: string;
  income: number; count: number; nextCost: number; incomeTotal: number;
  level: number; multiplier: number; upgradeCost: number | null; maxLevel: number;
}
interface Deposit {
  id: number; amount: number; rate: number; termLabel: string;
  secondsLeft: number; matured: boolean; payout: number;
}
interface DepositTerm { id: string; label: string; rate: number; }
interface GameState {
  cash: number; bankBalance: number; incomePerSecond: number; bankRatePerHour: number;
  netWorth: number; totalEarned: number;
  businesses: Business[]; deposits: Deposit[]; depositTerms: DepositTerm[];
  offlineCapHours: number;
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
  const [tab, setTab] = useState<'bisnis' | 'bank' | 'perusahaan' | 'bursa' | 'peringkat'>('bisnis');
  const [bankAmount, setBankAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositTerm, setDepositTerm] = useState('d30m');
  const [lbPeriod, setLbPeriod] = useState<'daily' | 'monthly' | 'alltime'>('daily');
  const [lb, setLb] = useState<any>(null);
  const [lbLoading, setLbLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [coLoading, setCoLoading] = useState(false);
  const [newCoName, setNewCoName] = useState('');
  const [market, setMarket] = useState<any[]>([]);
  const [mktLoading, setMktLoading] = useState(false);
  const [tradeQty, setTradeQty] = useState<Record<number, string>>({});

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

  const doAction = async (fn: () => Promise<any>, errMsg: string) => {
    try {
      const ns = await fn();
      setState(ns);
      setDisplayCash(ns.cash);
      setError('');
    } catch (e: any) {
      setError(e?.response?.data?.message || errMsg);
      setTimeout(() => setError(''), 1800);
    }
  };

  // Muat leaderboard saat tab peringkat aktif / ganti periode
  useEffect(() => {
    if (tab !== 'peringkat') return;
    let cancelled = false;
    setLbLoading(true);
    gameAPI.leaderboard(lbPeriod)
      .then(d => { if (!cancelled) setLb(d); })
      .catch(() => { if (!cancelled) setLb(null); })
      .finally(() => { if (!cancelled) setLbLoading(false); });
    return () => { cancelled = true; };
  }, [tab, lbPeriod]);

  // Muat perusahaan saat tab perusahaan aktif (refresh tiap 5 dtk utk treasury)
  const loadCompanies = useCallback(() => {
    gameAPI.getCompanies().then(setCompanies).catch(() => {});
  }, []);
  useEffect(() => {
    if (tab !== 'perusahaan') return;
    setCoLoading(true);
    gameAPI.getCompanies().then(setCompanies).catch(() => {}).finally(() => setCoLoading(false));
    const id = setInterval(loadCompanies, 5000);
    return () => clearInterval(id);
  }, [tab, loadCompanies]);

  // Muat bursa saham saat tab bursa aktif (refresh tiap 5 dtk)
  const loadMarket = useCallback(() => {
    gameAPI.getMarket().then(setMarket).catch(() => {});
  }, []);
  useEffect(() => {
    if (tab !== 'bursa') return;
    setMktLoading(true);
    gameAPI.getMarket().then(setMarket).catch(() => {}).finally(() => setMktLoading(false));
    const id = setInterval(loadMarket, 5000);
    return () => clearInterval(id);
  }, [tab, loadMarket]);

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

        {/* Tab switcher */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button onClick={() => setTab('bisnis')}
            className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${tab === 'bisnis' ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] border border-white/8'}`}>
            <Building2 size={14} /> Bisnis
          </button>
          <button onClick={() => setTab('bank')}
            className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${tab === 'bank' ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] border border-white/8'}`}>
            <Landmark size={14} /> Bank
          </button>
          <button onClick={() => setTab('perusahaan')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${tab === 'perusahaan' ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] border border-white/8'}`}>
            <Briefcase size={14} /> Perusahaan
          </button>
          <button onClick={() => setTab('bursa')}
            className={`flex-1 min-w-[75px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${tab === 'bursa' ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] border border-white/8'}`}>
            <LineChart size={14} /> Bursa
          </button>
          <button onClick={() => setTab('peringkat')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${tab === 'peringkat' ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] border border-white/8'}`}>
            <Medal size={14} /> Peringkat
          </button>
        </div>

        {/* TAB: BISNIS */}
        {tab === 'bisnis' && (
        <div className="space-y-2.5">
          {state.businesses.map(b => {
            const affordable = displayCash >= b.nextCost;
            const owned = b.count > 0;
            return (
              <div key={b.id} className={`flex items-center gap-3 p-4 rounded-2xl glass border transition-all ${owned ? 'border-white/10' : 'border-white/5 opacity-90'}`}>
                <div className="text-3xl shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-white/5">{b.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold text-sm">{b.name}</p>
                    {b.count > 0 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20">×{fmt(b.count)}</span>}
                    {b.level > 1 && <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">Lv.{b.level}</span>}
                  </div>
                  <p className="text-[#4A6080] text-[11px] mt-0.5">
                    +Rp {fmt(b.income)}/dtk per unit
                    {b.incomeTotal > 0 && <span className="text-[#00E676]"> · total +Rp {fmt(b.incomeTotal)}/dtk</span>}
                  </p>
                  {/* Tombol upgrade (hanya jika dimiliki) */}
                  {owned && b.upgradeCost != null && (
                    <button onClick={() => doAction(() => gameAPI.upgradeBusiness(b.id), 'Gagal upgrade')}
                      disabled={displayCash < b.upgradeCost}
                      className={`mt-1.5 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                        displayCash >= b.upgradeCost ? 'bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/20' : 'bg-white/3 text-[#4A6080] border-white/8 cursor-not-allowed'
                      }`}>
                      ⬆ Upgrade Lv.{b.level + 1} (+50%) · Rp {fmt(b.upgradeCost)}
                    </button>
                  )}
                  {owned && b.upgradeCost == null && b.level >= b.maxLevel && (
                    <span className="inline-block mt-1.5 text-[10px] text-[#00E676]">★ Level Maksimal</span>
                  )}
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
        )}

        {/* TAB: BANK */}
        {tab === 'bank' && (
        <div className="space-y-4">
          {/* Tabungan */}
          <div className="p-5 rounded-2xl glass border border-white/8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Landmark size={18} className="text-[#00D4FF]" />
                <h3 className="text-white font-bold">Tabungan</h3>
              </div>
              <span className="text-[10px] text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">+{state.bankRatePerHour}%/jam</span>
            </div>
            <p className="text-[#4A6080] text-xs mb-1">Saldo Bank</p>
            <p className="font-mono font-black text-2xl text-white mb-3">Rp {fmt(state.bankBalance)}</p>
            <p className="text-[#4A6080] text-[11px] mb-3">Bunga otomatis tiap detik. Bisa ditarik kapan saja.</p>
            <input type="number" value={bankAmount} onChange={e => setBankAmount(e.target.value)} placeholder="Jumlah"
              className="w-full mb-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]/50" />
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { const a = parseInt(bankAmount); if (a > 0) { doAction(() => gameAPI.bankDeposit(a), 'Gagal setor'); setBankAmount(''); } }}
                className="py-2.5 rounded-xl bg-[#00E676] text-[#060B18] font-bold text-sm hover:opacity-90">Setor</button>
              <button onClick={() => { const a = parseInt(bankAmount); if (a > 0) { doAction(() => gameAPI.bankWithdraw(a), 'Gagal tarik'); setBankAmount(''); } }}
                className="py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10">Tarik</button>
            </div>
          </div>

          {/* Deposito */}
          <div className="p-5 rounded-2xl glass border border-white/8">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={16} className="text-[#FFD700]" />
              <h3 className="text-white font-bold">Deposito</h3>
              <span className="text-[10px] text-[#FFD700]">imbal lebih besar, terkunci</span>
            </div>
            {/* Pilih tenor */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {state.depositTerms.map(t => (
                <button key={t.id} onClick={() => setDepositTerm(t.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${depositTerm === t.id ? 'bg-[#FFD700]/10 border-[#FFD700]/40' : 'bg-white/3 border-white/8'}`}>
                  <p className="text-white text-xs font-bold">{t.label}</p>
                  <p className="text-[#00E676] text-[10px] font-mono">+{(t.rate * 100).toFixed(1)}%</p>
                </button>
              ))}
            </div>
            <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} placeholder="Jumlah deposito"
              className="w-full mb-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#FFD700]/50" />
            <button onClick={() => { const a = parseInt(depositAmount); if (a > 0) { doAction(() => gameAPI.createDeposit(depositTerm, a), 'Gagal buat deposito'); setDepositAmount(''); } }}
              className="w-full py-2.5 rounded-xl bg-[#FFD700] text-[#060B18] font-bold text-sm hover:opacity-90 mb-4">Buat Deposito</button>

            {/* Deposito aktif */}
            {state.deposits.length > 0 ? (
              <div className="space-y-2">
                <p className="text-[#4A6080] text-[11px] uppercase tracking-wider">Deposito Aktif</p>
                {state.deposits.map(d => {
                  const h = Math.floor(d.secondsLeft / 3600);
                  const m = Math.floor((d.secondsLeft % 3600) / 60);
                  const s = d.secondsLeft % 60;
                  return (
                    <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-white/5">
                      <div>
                        <p className="text-white text-sm font-mono font-bold">Rp {fmt(d.amount)} <span className="text-[#00E676] text-xs">→ Rp {fmt(d.payout)}</span></p>
                        <p className="text-[#4A6080] text-[10px]">{d.termLabel} · {d.matured ? 'Jatuh tempo!' : `sisa ${h}j ${m}m ${s}d`}</p>
                      </div>
                      <button onClick={() => doAction(() => gameAPI.claimDeposit(d.id), 'Belum bisa dicairkan')} disabled={!d.matured}
                        className={`px-3 py-2 rounded-lg font-bold text-xs ${d.matured ? 'bg-[#00E676] text-[#060B18] hover:opacity-90' : 'bg-white/5 text-[#4A6080] cursor-not-allowed'}`}>
                        Cairkan
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[#4A6080] text-xs text-center py-2">Belum ada deposito aktif.</p>
            )}
          </div>
        </div>
        )}

        {/* TAB: PERUSAHAAN */}
        {tab === 'perusahaan' && (
        <div className="space-y-4">
          {/* Dirikan perusahaan */}
          <div className="p-5 rounded-2xl glass border border-white/8">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={18} className="text-[#7B2FFF]" />
              <h3 className="text-white font-bold">Dirikan Perusahaan</h3>
            </div>
            <p className="text-[#4A6080] text-xs mb-3">Modal Rp 1.000.000. Perusahaan menghasilkan revenue/detik ke kasnya, bisa di-upgrade & nanti IPO.</p>
            <div className="flex gap-2">
              <input value={newCoName} onChange={e => setNewCoName(e.target.value)} placeholder="Nama perusahaan (mis. PT Maju Jaya)" maxLength={40}
                className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#7B2FFF]/50" />
              <button onClick={() => { if (newCoName.trim().length >= 2) { doAction(async () => { await gameAPI.foundCompany(newCoName.trim()); loadCompanies(); return await gameAPI.getState(); }, 'Gagal mendirikan'); setNewCoName(''); } }}
                disabled={displayCash < 1000000}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm ${displayCash >= 1000000 ? 'bg-[#7B2FFF] text-white hover:opacity-90' : 'bg-white/5 text-[#4A6080] cursor-not-allowed'}`}>
                Dirikan
              </button>
            </div>
          </div>

          {/* Daftar perusahaanku */}
          {coLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#00D4FF]" size={24} /></div>
          ) : companies.length === 0 ? (
            <p className="text-[#4A6080] text-sm text-center py-6">Belum punya perusahaan. Dirikan yang pertama!</p>
          ) : (
            <div className="space-y-3">
              {companies.map(co => (
                <div key={co.id} className="p-5 rounded-2xl glass border border-white/8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-bold">{co.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">Lv.{co.level}</span>
                        {co.isPublic && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/20">PUBLIC</span>}
                      </div>
                      <p className="text-[#00E676] text-xs font-mono mt-0.5">+Rp {fmt(co.revenuePerSec)}/dtk</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#4A6080] text-[10px]">Kas Perusahaan</p>
                      <p className="font-mono font-bold text-white">Rp {fmt(co.treasury)}</p>
                    </div>
                  </div>
                  {co.upgradeCost != null ? (
                    <button onClick={() => doAction(async () => { await gameAPI.upgradeCompany(co.id); loadCompanies(); return await gameAPI.getState(); }, 'Gagal upgrade')}
                      disabled={co.treasury < co.upgradeCost}
                      className={`w-full py-2 rounded-xl font-bold text-xs ${co.treasury >= co.upgradeCost ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30 hover:bg-[#FFD700]/25' : 'bg-white/3 text-[#4A6080] border border-white/8 cursor-not-allowed'}`}>
                      ⬆ Upgrade Lv.{co.level + 1} → +Rp {fmt(co.nextRevenue)}/dtk · biaya Rp {fmt(co.upgradeCost)} (dari kas)
                    </button>
                  ) : (
                    <p className="text-center text-[10px] text-[#00E676]">★ Level Maksimal</p>
                  )}

                  {/* IPO / status publik */}
                  {co.isPublic ? (
                    <div className="mt-2 space-y-2">
                      <div className="p-2.5 rounded-xl bg-[#00E676]/6 border border-[#00E676]/15 flex items-center justify-between">
                        <span className="text-[#8BA8C2] text-[11px]">Harga saham · {co.holders} pemegang</span>
                        <span className="font-mono text-[#00E676] text-sm font-bold">Rp {fmt(co.sharePrice, 2)}</span>
                      </div>
                      <button onClick={() => doAction(async () => { const r = await gameAPI.distributeDividend(co.id); loadCompanies(); return await gameAPI.getState(); }, 'Gagal bagi dividen')}
                        disabled={co.treasury < 1}
                        className={`w-full py-2 rounded-xl font-bold text-xs ${co.treasury >= 1 ? 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30 hover:bg-[#00D4FF]/25' : 'bg-white/3 text-[#4A6080] border border-white/8 cursor-not-allowed'}`}>
                        💰 Bagikan Dividen (Rp {fmt(co.treasury)} dari kas → pemegang saham)
                      </button>
                    </div>
                  ) : co.canIpo ? (
                    <button onClick={() => doAction(async () => { await gameAPI.ipoCompany(co.id); loadCompanies(); return await gameAPI.getState(); }, 'Gagal IPO')}
                      className="mt-2 w-full py-2 rounded-xl font-bold text-xs bg-[#7B2FFF] text-white hover:opacity-90">
                      📈 IPO Sekarang (≈ Rp {fmt(co.estIpoPrice)}/saham, kamu dapat 5.000 saham)
                    </button>
                  ) : (
                    <p className="text-center text-[10px] text-[#4A6080] mt-2">Capai Level {co.ipoMinLevel} untuk bisa IPO saham.</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* TAB: BURSA SAHAM */}
        {tab === 'bursa' && (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-[#7B2FFF]/8 border border-[#7B2FFF]/20 mb-1">
            <p className="text-[#8BA8C2] text-[11px]">📊 Beli saham perusahaan publik. Harga naik saat dibeli, turun saat dijual (market-maker). Pegang saham untuk dapat dividen nanti.</p>
          </div>
          {mktLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#00D4FF]" size={24} /></div>
          ) : market.length === 0 ? (
            <p className="text-[#4A6080] text-sm text-center py-8">
              Belum ada perusahaan yang IPO.<br/>
              <span className="text-[11px]">Dirikan perusahaan, naikkan ke Level 3, lalu IPO untuk muncul di bursa!</span>
            </p>
          ) : (
            market.map(co => {
              const qty = tradeQty[co.id] || '';
              const q = parseInt(qty) || 0;
              return (
                <div key={co.id} className="p-4 rounded-2xl glass border border-white/8">
                  <div className="flex items-center justify-between mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-bold text-sm truncate">{co.name}</p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">Lv.{co.level}</span>
                        {co.isMine && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#7B2FFF]/15 text-[#a875ff] border border-[#7B2FFF]/25">Punyamu</span>}
                      </div>
                      <p className="text-[#4A6080] text-[10px] mt-0.5">oleh {co.ownerName} · +Rp {fmt(co.revenuePerSec)}/dtk</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-mono font-black text-[#00E676]">Rp {fmt(co.price, 2)}</p>
                      <p className="text-[#4A6080] text-[10px]">/saham</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-[#8BA8C2] mb-2">
                    <span>Sahammu: <b className="text-white font-mono">{fmt(co.myShares)}</b></span>
                    <span>·</span>
                    <span>Tersedia: <b className="text-white font-mono">{fmt(co.available)}</b></span>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" value={qty} onChange={e => setTradeQty(p => ({ ...p, [co.id]: e.target.value }))}
                      placeholder="Jml saham"
                      className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]/50" />
                    <button onClick={() => { if (q > 0) doAction(async () => { const r = await gameAPI.buyShares(co.id, q); setMarket(r.market); setTradeQty(p => ({ ...p, [co.id]: '' })); return await gameAPI.getState(); }, 'Gagal beli'); }}
                      className="px-3 py-2 rounded-xl bg-[#00E676] text-[#060B18] font-bold text-xs hover:opacity-90">Beli</button>
                    <button onClick={() => { if (q > 0) doAction(async () => { const r = await gameAPI.sellShares(co.id, q); setMarket(r.market); setTradeQty(p => ({ ...p, [co.id]: '' })); return await gameAPI.getState(); }, 'Gagal jual'); }}
                      disabled={co.myShares <= 0}
                      className={`px-3 py-2 rounded-xl font-bold text-xs ${co.myShares > 0 ? 'bg-[#FF4757] text-white hover:opacity-90' : 'bg-white/5 text-[#4A6080] cursor-not-allowed'}`}>Jual</button>
                  </div>
                  {q > 0 && (
                    <p className="text-[#4A6080] text-[10px] mt-1.5 text-center">≈ Rp {fmt(q * co.price)} untuk {fmt(q)} saham (harga bergerak saat transaksi)</p>
                  )}
                </div>
              );
            })
          )}
        </div>
        )}

        {/* TAB: PERINGKAT */}
        {tab === 'peringkat' && (
        <div>
          {/* Pilih periode */}
          <div className="flex gap-2 mb-4">
            {([['daily', 'Harian'], ['monthly', 'Bulanan'], ['alltime', 'Sepanjang Masa']] as const).map(([p, label]) => (
              <button key={p} onClick={() => setLbPeriod(p)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${lbPeriod === p ? 'bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30' : 'bg-white/3 text-[#8BA8C2] border border-white/8'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Peringkat pemain sendiri */}
          {lb?.me && (
            <div className="mb-3 p-3 rounded-xl bg-[#00D4FF]/8 border border-[#00D4FF]/25 flex items-center justify-between">
              <span className="text-[#00D4FF] text-sm font-bold">Peringkatmu: #{lb.me.rank}</span>
              <span className="font-mono text-white text-sm">{lbPeriod === 'alltime' ? 'Kekayaan' : 'Profit'}: Rp {fmt(lb.me.score)}</span>
            </div>
          )}

          {lbLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#00D4FF]" size={24} /></div>
          ) : !lb || lb.top.length === 0 ? (
            <p className="text-[#4A6080] text-sm text-center py-8">
              Belum ada data peringkat untuk periode ini.<br/>
              <span className="text-[11px]">Main & kumpulkan kekayaan untuk masuk papan peringkat!</span>
            </p>
          ) : (
            <div className="space-y-1.5">
              {lb.top.map((row: any) => {
                const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : null;
                return (
                  <div key={row.rank + row.name} className={`flex items-center gap-3 p-3 rounded-xl border ${row.isMe ? 'bg-[#00D4FF]/10 border-[#00D4FF]/30' : 'bg-white/3 border-white/5'}`}>
                    <div className="w-8 text-center shrink-0">
                      {medal ? <span className="text-lg">{medal}</span> : <span className="text-[#4A6080] font-mono text-sm font-bold">#{row.rank}</span>}
                    </div>
                    <p className={`flex-1 min-w-0 truncate text-sm font-semibold ${row.isMe ? 'text-[#00D4FF]' : 'text-white'}`}>
                      {row.name}{row.isMe && ' (kamu)'}
                    </p>
                    <p className="font-mono text-sm font-bold text-[#FFD700] shrink-0">Rp {fmt(row.score)}</p>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[#4A6080] text-[10px] text-center mt-4">
            {lbPeriod === 'alltime' ? 'Diurutkan dari total kekayaan.' : `Diurutkan dari profit ${lbPeriod === 'daily' ? 'hari' : 'bulan'} ini.`} Reset otomatis tiap periode.
          </p>
        </div>
        )}

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
