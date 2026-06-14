'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Gamepad2, TrendingUp, TrendingDown, Wallet, Trophy, RotateCcw, Pause, Play, Zap, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Konstanta game
const START_CASH = 10_000_000;
const TICK_MS = 900;
const CANDLE_TICKS = 3;
const MAX_CANDLES = 40;
const SEED_CANDLES = 30;

type Candle = { o: number; h: number; l: number; c: number };
type Coin = {
  symbol: string;
  name: string;
  emoji: string;
  color: string;
  price: number;
  anchor: number;
  vol: number;
  drift: number;
  candles: Candle[];
  tickInCandle: number;
};
type Holdings = Record<string, number>;

// Koin fiktif (bukan aset nyata — murni game)
const COIN_DEFS: Omit<Coin, 'price' | 'candles' | 'tickInCandle'>[] = [
  { symbol: 'ROK', name: 'RokenCoin',  emoji: '🚀', color: '#00D4FF', anchor: 5000,   vol: 0.030, drift: 0.0008 },
  { symbol: 'DMD', name: 'DiamondX',   emoji: '💎', color: '#7B2FFF', anchor: 25000,  vol: 0.012, drift: 0.0004 },
  { symbol: 'FLM', name: 'FlameToken', emoji: '🔥', color: '#FF4757', anchor: 1200,   vol: 0.050, drift: 0.0000 },
  { symbol: 'VLT', name: 'VoltCoin',   emoji: '⚡', color: '#FFD700', anchor: 8000,   vol: 0.022, drift: 0.0006 },
  { symbol: 'DGM', name: 'DogeMoon',   emoji: '🐕', color: '#00E676', anchor: 300,    vol: 0.065, drift: -0.0002 },
  { symbol: 'LUN', name: 'LunaGold',   emoji: '🌙', color: '#C5D5E8', anchor: 15000,  vol: 0.018, drift: 0.0005 },
];

const RANKS = [
  { min: 0,            label: 'Trader Buntung', emoji: '😅', color: '#FF4757' },
  { min: START_CASH,   label: 'Pemula',         emoji: '🌱', color: '#8BA8C2' },
  { min: 15_000_000,   label: 'Trader Cerdas',  emoji: '📈', color: '#00D4FF' },
  { min: 25_000_000,   label: 'Sultan Saham',   emoji: '💰', color: '#FFD700' },
  { min: 50_000_000,   label: 'Raja Pasar',     emoji: '🦁', color: '#7B2FFF' },
  { min: 100_000_000,  label: 'Dewa Trading',   emoji: '👑', color: '#00E676' },
];

function getRank(netWorth: number) {
  let r = RANKS[0];
  for (const rank of RANKS) if (netWorth >= rank.min) r = rank;
  return r;
}

// Box-Muller gaussian
function gaussian() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const fmt = (n: number, dec = 0) =>
  isFinite(n) ? n.toLocaleString('id-ID', { maximumFractionDigits: dec, minimumFractionDigits: 0 }) : '—';

// Buat 1 koin lengkap dengan riwayat candle awal (di-seed agar grafik tidak kosong)
function makeCoin(def: typeof COIN_DEFS[number]): Coin {
  let price = def.anchor;
  const candles: Candle[] = [];
  for (let i = 0; i < SEED_CANDLES; i++) {
    const o = price;
    let h = price, l = price;
    for (let t = 0; t < CANDLE_TICKS; t++) {
      const shock = gaussian() * def.vol;
      price = Math.max(def.anchor * 0.2, price * (1 + def.drift + shock));
      h = Math.max(h, price); l = Math.min(l, price);
    }
    candles.push({ o, h, l, c: price });
  }
  return { ...def, price, candles, tickInCandle: 0 };
}

function stepCoin(coin: Coin): Coin {
  const meanRevert = ((coin.anchor - coin.price) / coin.anchor) * 0.0015;
  const shock = gaussian() * coin.vol;
  let price = Math.max(coin.anchor * 0.15, coin.price * (1 + coin.drift + meanRevert + shock));

  const candles = coin.candles.slice();
  let cur = { ...candles[candles.length - 1] };
  cur.c = price;
  cur.h = Math.max(cur.h, price);
  cur.l = Math.min(cur.l, price);
  candles[candles.length - 1] = cur;

  let tickInCandle = coin.tickInCandle + 1;
  if (tickInCandle >= CANDLE_TICKS) {
    tickInCandle = 0;
    candles.push({ o: price, h: price, l: price, c: price });
    if (candles.length > MAX_CANDLES) candles.shift();
  }
  return { ...coin, price, candles, tickInCandle };
}

// ─────────────────────────────────────────────────────────
export default function GamePage() {
  const [coins, setCoins] = useState<Coin[]>(() => COIN_DEFS.map(makeCoin));
  const [cash, setCash] = useState(START_CASH);
  const [holdings, setHoldings] = useState<Holdings>({});
  const [selected, setSelected] = useState('ROK');
  const [qty, setQty] = useState(1);
  const [running, setRunning] = useState(true);
  const [best, setBest] = useState(START_CASH);
  const [news, setNews] = useState<string[]>(['🎮 Selamat datang di Trader Tycoon! Beli murah, jual mahal, jadi sultan!']);
  const [flash, setFlash] = useState<Record<string, 'up' | 'down'>>({});

  const tickRef = useRef(0);
  const coinsRef = useRef(coins);
  coinsRef.current = coins;

  // Muat best dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tradertycoon_best');
      if (saved) setBest(Math.max(START_CASH, Number(saved) || START_CASH));
    } catch {}
  }, []);

  const netWorth = cash + coinsRef.current.reduce((sum, c) => sum + (holdings[c.symbol] || 0) * c.price, 0);
  const profit = netWorth - START_CASH;
  const profitPct = (profit / START_CASH) * 100;
  const rank = getRank(netWorth);

  // Simpan best
  useEffect(() => {
    if (netWorth > best) {
      setBest(netWorth);
      try { localStorage.setItem('tradertycoon_best', String(Math.round(netWorth))); } catch {}
    }
  }, [netWorth, best]);

  // Game loop
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      tickRef.current++;
      setCoins(prev => {
        const prevPrices: Record<string, number> = {};
        prev.forEach(c => { prevPrices[c.symbol] = c.price; });
        let next = prev.map(stepCoin);

        // Event acak: pump / crash
        if (Math.random() < 0.10) {
          const idx = Math.floor(Math.random() * next.length);
          const coin = { ...next[idx] };
          const isPump = Math.random() < 0.55;
          const mult = isPump ? (1.10 + Math.random() * 0.30) : (0.70 + Math.random() * 0.15);
          coin.price = Math.max(coin.anchor * 0.15, coin.price * mult);
          const cur = { ...coin.candles[coin.candles.length - 1] };
          cur.c = coin.price; cur.h = Math.max(cur.h, coin.price); cur.l = Math.min(cur.l, coin.price);
          coin.candles = [...coin.candles.slice(0, -1), cur];
          next[idx] = coin;
          const msg = isPump
            ? `🚀 ${coin.name} (${coin.symbol}) MELAMBUNG +${Math.round((mult - 1) * 100)}%! Whale masuk!`
            : `💥 ${coin.name} (${coin.symbol}) AMBRUK ${Math.round((mult - 1) * 100)}%! Panic sell!`;
          setNews(n => [msg, ...n].slice(0, 6));
        }

        // Flash warna
        const f: Record<string, 'up' | 'down'> = {};
        next.forEach(c => {
          if (c.price > prevPrices[c.symbol]) f[c.symbol] = 'up';
          else if (c.price < prevPrices[c.symbol]) f[c.symbol] = 'down';
        });
        setFlash(f);
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  const sel = coins.find(c => c.symbol === selected)!;
  const selHold = holdings[selected] || 0;
  const maxBuy = Math.floor(cash / sel.price);

  const buy = useCallback((amount: number) => {
    const cost = amount * sel.price;
    if (amount <= 0 || cost > cash) return;
    setCash(c => c - cost);
    setHoldings(h => ({ ...h, [selected]: (h[selected] || 0) + amount }));
  }, [sel.price, cash, selected]);

  const sell = useCallback((amount: number) => {
    const have = holdings[selected] || 0;
    const amt = Math.min(amount, have);
    if (amt <= 0) return;
    setCash(c => c + amt * sel.price);
    setHoldings(h => ({ ...h, [selected]: have - amt }));
  }, [sel.price, holdings, selected]);

  const reset = () => {
    setCoins(COIN_DEFS.map(makeCoin));
    setCash(START_CASH);
    setHoldings({});
    setQty(1);
    setNews(['🔄 Game di-reset! Modal kembali Rp 10 juta. Semoga sukses!']);
  };

  // Chart candlestick SVG
  const renderChart = () => {
    const candles = sel.candles;
    const W = 600, H = 260, PAD = 8;
    const lows = candles.map(c => c.l), highs = candles.map(c => c.h);
    const min = Math.min(...lows), max = Math.max(...highs);
    const range = max - min || 1;
    const cw = (W - PAD * 2) / candles.length;
    const y = (v: number) => PAD + (1 - (v - min) / range) * (H - PAD * 2);

    return (
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={sel.color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={sel.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* garis harga terkini */}
        <line x1="0" y1={y(sel.price)} x2={W} y2={y(sel.price)} stroke={sel.color} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
        {candles.map((c, i) => {
          const x = PAD + i * cw + cw / 2;
          const up = c.c >= c.o;
          const col = up ? '#00E676' : '#FF4757';
          const bodyTop = y(Math.max(c.o, c.c));
          const bodyBot = y(Math.min(c.o, c.c));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          const bw = Math.max(1.5, cw * 0.6);
          return (
            <g key={i}>
              <line x1={x} y1={y(c.h)} x2={x} y2={y(c.l)} stroke={col} strokeWidth="1" opacity="0.7" />
              <rect x={x - bw / 2} y={bodyTop} width={bw} height={bodyH} fill={col} opacity="0.9" rx="0.5" />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#7B2FFF]/10 border border-[#7B2FFF]/30 text-[#7B2FFF] text-xs font-semibold mb-3">
              <Gamepad2 size={12} /> Game Simulasi
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-white mb-2">Trader Tycoon</h1>
            <p className="text-[#8BA8C2] text-sm">Modal virtual Rp 10 juta. Beli murah, jual mahal — seberapa kaya kamu bisa jadi?</p>
          </div>

          {/* Panel skor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-2xl glass border border-white/8">
              <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet size={10} /> Kekayaan</p>
              <p className="font-mono font-black text-lg text-white">Rp {fmt(netWorth)}</p>
            </div>
            <div className="p-3 rounded-2xl glass border border-white/8">
              <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Cash</p>
              <p className="font-mono font-bold text-lg text-[#8BA8C2]">Rp {fmt(cash)}</p>
            </div>
            <div className="p-3 rounded-2xl glass border border-white/8">
              <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Profit</p>
              <p className={`font-mono font-bold text-lg ${profit >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                {profit >= 0 ? '+' : ''}{fmt(profitPct, 1)}%
              </p>
            </div>
            <div className="p-3 rounded-2xl glass border border-white/8">
              <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1"><Trophy size={10} /> Rank</p>
              <p className="font-bold text-lg" style={{ color: rank.color }}>{rank.emoji} {rank.label}</p>
            </div>
          </div>

          {/* News ticker */}
          <div className="mb-4 p-2.5 rounded-xl bg-white/3 border border-white/5 overflow-hidden">
            <p className="text-xs text-[#C5D5E8] whitespace-nowrap animate-pulse">{news[0]}</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Daftar koin */}
            <div className="space-y-2">
              {coins.map(c => {
                const change = ((c.candles[c.candles.length - 1].c - c.candles[0].o) / c.candles[0].o) * 100;
                const isSel = c.symbol === selected;
                const fl = flash[c.symbol];
                return (
                  <button key={c.symbol} onClick={() => setSelected(c.symbol)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isSel ? 'bg-white/8 border-[#00D4FF]/40' : 'bg-white/3 border-white/5 hover:border-white/15'
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{c.emoji}</span>
                      <div className="text-left">
                        <p className="text-white text-sm font-bold leading-none">{c.symbol}</p>
                        <p className="text-[#4A6080] text-[10px]">{c.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono text-sm font-bold transition-colors ${fl === 'up' ? 'text-[#00E676]' : fl === 'down' ? 'text-[#FF4757]' : 'text-white'}`}>
                        {fmt(c.price)}
                      </p>
                      <p className={`text-[10px] font-mono ${change >= 0 ? 'text-[#00E676]' : 'text-[#FF4757]'}`}>
                        {change >= 0 ? '▲' : '▼'} {fmt(Math.abs(change), 1)}%
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Chart + trading */}
            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl glass border border-white/8 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sel.emoji}</span>
                    <div>
                      <p className="text-white font-bold leading-none">{sel.name} <span className="text-[#4A6080] text-xs">({sel.symbol})</span></p>
                      <p className="font-mono text-lg font-black" style={{ color: sel.color }}>Rp {fmt(sel.price)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setRunning(r => !r)} className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white transition-colors">
                      {running ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={reset} className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white transition-colors">
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>
                <div className="h-48 sm:h-56">{renderChart()}</div>
              </div>

              {/* Panel beli/jual */}
              <div className="rounded-2xl glass border border-white/8 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#8BA8C2] text-sm">Kamu punya: <span className="text-white font-mono font-bold">{fmt(selHold)} {sel.symbol}</span></p>
                  <p className="text-[#4A6080] text-xs">≈ Rp {fmt(selHold * sel.price)}</p>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white font-bold">−</button>
                  <input type="number" value={qty} min={1}
                    onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center px-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-[#00D4FF]/50" />
                  <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white font-bold">+</button>
                  <button onClick={() => setQty(q => q + 10)} className="px-3 h-9 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] text-xs">+10</button>
                  <button onClick={() => setQty(Math.max(1, maxBuy))} className="px-3 h-9 rounded-lg bg-white/5 border border-white/10 text-[#00D4FF] text-xs font-bold">MAX</button>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button onClick={() => buy(qty)} disabled={qty * sel.price > cash}
                    className="py-3 rounded-xl bg-[#00E676] text-[#060B18] font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                    <TrendingUp size={15} /> BELI ({fmt(qty)})
                  </button>
                  <button onClick={() => sell(qty)} disabled={selHold <= 0}
                    className="py-3 rounded-xl bg-[#FF4757] text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                    <TrendingDown size={15} /> JUAL ({fmt(Math.min(qty, selHold))})
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => sell(selHold)} disabled={selHold <= 0}
                    className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-[#8BA8C2] text-xs disabled:opacity-30">Jual Semua</button>
                  <p className="flex-1 text-right text-[10px] text-[#4A6080] self-center">Biaya beli: Rp {fmt(qty * sel.price)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Holdings */}
          {Object.entries(holdings).some(([, q]) => q > 0) && (
            <div className="mt-4 rounded-2xl glass border border-white/8 p-4">
              <p className="text-[#4A6080] text-xs uppercase tracking-wider mb-2">Portofolio</p>
              <div className="flex flex-wrap gap-2">
                {coins.filter(c => (holdings[c.symbol] || 0) > 0).map(c => (
                  <div key={c.symbol} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
                    <span>{c.emoji}</span>
                    <span className="text-white text-sm font-mono">{fmt(holdings[c.symbol])} {c.symbol}</span>
                    <span className="text-[#4A6080] text-xs">Rp {fmt(holdings[c.symbol] * c.price)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best score */}
          <div className="mt-4 text-center">
            <p className="text-[#4A6080] text-xs">🏆 Rekor kekayaan terbaikmu: <span className="text-[#FFD700] font-mono font-bold">Rp {fmt(best)}</span></p>
          </div>

          {/* Disclaimer + CTA */}
          <div className="mt-6 p-5 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <p className="text-[#8BA8C2] text-xs mb-3">
              🎮 Ini game simulasi dengan koin & uang fiktif untuk hiburan dan edukasi. Bukan trading nyata, bukan rekomendasi keuangan. Harga digerakkan secara acak.
            </p>
            <p className="text-white text-sm font-bold mb-3">Mau coba trading beneran dengan analisa sungguhan?</p>
            <a href="/signals" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
              <Zap size={14} fill="white" /> Lihat Sinyal Trading Asli <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
