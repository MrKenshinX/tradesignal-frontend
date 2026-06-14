'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Calculator, Shield, TrendingUp, Percent, ArrowRight } from 'lucide-react';

type Tab = 'position' | 'rr' | 'pnl' | 'compound';

const fmt = (n: number, dec = 0) =>
  isFinite(n) ? n.toLocaleString('id-ID', { maximumFractionDigits: dec, minimumFractionDigits: dec > 0 ? dec : 0 }) : '—';

function Field({ label, value, onChange, suffix, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; suffix?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[#8BA8C2] text-xs mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:border-[#00D4FF]/50 focus:outline-none transition-colors"
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6080] text-xs">{suffix}</span>}
      </div>
    </div>
  );
}

function ResultRow({ label, value, highlight, color }: { label: string; value: string; highlight?: boolean; color?: string }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${highlight ? '' : 'border-b border-white/5'}`}>
      <span className="text-[#8BA8C2] text-sm">{label}</span>
      <span className={`font-mono font-bold ${highlight ? 'text-lg' : 'text-sm'}`} style={{ color: color || '#fff' }}>{value}</span>
    </div>
  );
}

// ── Position Sizing ──
function PositionSizing() {
  const [capital, setCapital] = useState('');
  const [riskPct, setRiskPct] = useState('2');
  const [entry, setEntry] = useState('');
  const [sl, setSl] = useState('');

  const cap = parseFloat(capital) || 0;
  const risk = parseFloat(riskPct) || 0;
  const e = parseFloat(entry) || 0;
  const s = parseFloat(sl) || 0;

  const riskAmount = cap * (risk / 100);
  const riskPerShare = Math.abs(e - s);
  const shares = riskPerShare > 0 ? Math.floor(riskAmount / riskPerShare) : 0;
  const positionValue = shares * e;
  const pctOfCapital = cap > 0 ? (positionValue / cap) * 100 : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Field label="Modal Total" value={capital} onChange={setCapital} suffix="Rp" placeholder="10000000" />
        <Field label="Risiko per Trade" value={riskPct} onChange={setRiskPct} suffix="%" placeholder="2" />
        <Field label="Harga Entry" value={entry} onChange={setEntry} suffix="Rp" placeholder="1000" />
        <Field label="Stop Loss" value={sl} onChange={setSl} suffix="Rp" placeholder="950" />
      </div>
      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
        <p className="text-[#4A6080] text-xs uppercase tracking-wider mb-3">Hasil</p>
        <ResultRow label="Risiko (Rp)" value={`Rp ${fmt(riskAmount)}`} color="#FF4757" />
        <ResultRow label="Risiko per lembar" value={`Rp ${fmt(riskPerShare, 2)}`} />
        <ResultRow label="Nilai posisi" value={`Rp ${fmt(positionValue)}`} />
        <ResultRow label="% dari modal" value={`${fmt(pctOfCapital, 1)}%`} color={pctOfCapital > 50 ? '#FF4757' : '#8BA8C2'} />
        <div className="mt-3 pt-3 border-t border-white/10">
          <ResultRow label="Jumlah Saham/Unit" value={fmt(shares)} highlight color="#00E676" />
          <p className="text-[#4A6080] text-[10px] mt-1">≈ {fmt(shares / 100)} lot (1 lot = 100 lembar)</p>
        </div>
      </div>
    </div>
  );
}

// ── Risk/Reward ──
function RiskReward() {
  const [entry, setEntry] = useState('');
  const [target, setTarget] = useState('');
  const [sl, setSl] = useState('');

  const e = parseFloat(entry) || 0;
  const t = parseFloat(target) || 0;
  const s = parseFloat(sl) || 0;
  const reward = Math.abs(t - e);
  const risk = Math.abs(e - s);
  const rr = risk > 0 ? reward / risk : 0;
  const rewardPct = e > 0 ? (reward / e) * 100 : 0;
  const riskPct = e > 0 ? (risk / e) * 100 : 0;
  const quality = rr >= 2 ? 'Bagus' : rr >= 1 ? 'Cukup' : rr > 0 ? 'Kurang' : '—';
  const qColor = rr >= 2 ? '#00E676' : rr >= 1 ? '#FFD700' : '#FF4757';

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Field label="Harga Entry" value={entry} onChange={setEntry} suffix="Rp" placeholder="1000" />
        <Field label="Target (Take Profit)" value={target} onChange={setTarget} suffix="Rp" placeholder="1100" />
        <Field label="Stop Loss" value={sl} onChange={setSl} suffix="Rp" placeholder="950" />
      </div>
      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
        <p className="text-[#4A6080] text-xs uppercase tracking-wider mb-3">Hasil</p>
        <ResultRow label="Potensi Profit" value={`Rp ${fmt(reward, 2)} (${fmt(rewardPct, 1)}%)`} color="#00E676" />
        <ResultRow label="Potensi Rugi" value={`Rp ${fmt(risk, 2)} (${fmt(riskPct, 1)}%)`} color="#FF4757" />
        <div className="mt-3 pt-3 border-t border-white/10">
          <ResultRow label="Rasio Risk/Reward" value={rr > 0 ? `1 : ${fmt(rr, 2)}` : '—'} highlight color={qColor} />
          <p className="text-[10px] mt-1" style={{ color: qColor }}>Kualitas: {quality} {rr >= 2 && '— ideal untuk trading'}</p>
        </div>
      </div>
    </div>
  );
}

// ── Profit/Loss dengan fee broker ──
function ProfitLoss() {
  const [buy, setBuy] = useState('');
  const [sell, setSell] = useState('');
  const [lot, setLot] = useState('');
  const [feeBuy, setFeeBuy] = useState('0.15');
  const [feeSell, setFeeSell] = useState('0.25');

  const b = parseFloat(buy) || 0;
  const s = parseFloat(sell) || 0;
  const shares = (parseFloat(lot) || 0) * 100;
  const fb = parseFloat(feeBuy) || 0;
  const fs = parseFloat(feeSell) || 0;

  const buyValue = b * shares;
  const sellValue = s * shares;
  const buyFee = buyValue * (fb / 100);
  const sellFee = sellValue * (fs / 100);
  const totalCost = buyValue + buyFee;
  const totalReceived = sellValue - sellFee;
  const netPnl = totalReceived - totalCost;
  const netPct = totalCost > 0 ? (netPnl / totalCost) * 100 : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Field label="Harga Beli" value={buy} onChange={setBuy} suffix="Rp" placeholder="1000" />
        <Field label="Harga Jual" value={sell} onChange={setSell} suffix="Rp" placeholder="1100" />
        <Field label="Jumlah Lot" value={lot} onChange={setLot} suffix="lot" placeholder="10" />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Fee Beli" value={feeBuy} onChange={setFeeBuy} suffix="%" />
          <Field label="Fee Jual" value={feeSell} onChange={setFeeSell} suffix="%" />
        </div>
      </div>
      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
        <p className="text-[#4A6080] text-xs uppercase tracking-wider mb-3">Hasil</p>
        <ResultRow label="Nilai beli + fee" value={`Rp ${fmt(totalCost)}`} />
        <ResultRow label="Nilai jual - fee" value={`Rp ${fmt(totalReceived)}`} />
        <ResultRow label="Total fee broker" value={`Rp ${fmt(buyFee + sellFee)}`} color="#FFD700" />
        <div className="mt-3 pt-3 border-t border-white/10">
          <ResultRow label={netPnl >= 0 ? 'Keuntungan Bersih' : 'Kerugian Bersih'}
            value={`Rp ${fmt(netPnl)} (${netPct >= 0 ? '+' : ''}${fmt(netPct, 2)}%)`}
            highlight color={netPnl >= 0 ? '#00E676' : '#FF4757'} />
        </div>
        <p className="text-[#4A6080] text-[10px] mt-2">Fee default ≈ Ajaib/umum. Sesuaikan dengan brokermu.</p>
      </div>
    </div>
  );
}

// ── Compounding ──
function Compounding() {
  const [initial, setInitial] = useState('');
  const [monthlyPct, setMonthlyPct] = useState('5');
  const [months, setMonths] = useState('12');

  const init = parseFloat(initial) || 0;
  const rate = (parseFloat(monthlyPct) || 0) / 100;
  const n = parseInt(months) || 0;
  const final = init * Math.pow(1 + rate, n);
  const profit = final - init;
  const profitPct = init > 0 ? (profit / init) * 100 : 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Field label="Modal Awal" value={initial} onChange={setInitial} suffix="Rp" placeholder="10000000" />
        <Field label="Target Profit per Bulan" value={monthlyPct} onChange={setMonthlyPct} suffix="%" placeholder="5" />
        <Field label="Jangka Waktu" value={months} onChange={setMonths} suffix="bulan" placeholder="12" />
      </div>
      <div className="p-5 rounded-2xl bg-white/3 border border-white/8">
        <p className="text-[#4A6080] text-xs uppercase tracking-wider mb-3">Hasil (bunga majemuk)</p>
        <ResultRow label="Modal awal" value={`Rp ${fmt(init)}`} />
        <ResultRow label="Total profit" value={`Rp ${fmt(profit)} (${fmt(profitPct, 0)}%)`} color="#00E676" />
        <div className="mt-3 pt-3 border-t border-white/10">
          <ResultRow label={`Modal akhir (${n} bulan)`} value={`Rp ${fmt(final)}`} highlight color="#00D4FF" />
        </div>
        <p className="text-[#4A6080] text-[10px] mt-2">Ilustrasi jika profit konsisten di-reinvest. Hasil nyata bervariasi & tidak dijamin.</p>
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string; icon: typeof Calculator }[] = [
  { id: 'position', label: 'Position Sizing', icon: Shield },
  { id: 'rr', label: 'Risk/Reward', icon: TrendingUp },
  { id: 'pnl', label: 'Profit/Loss', icon: Calculator },
  { id: 'compound', label: 'Compounding', icon: Percent },
];

export default function ToolsPage() {
  const [tab, setTab] = useState<Tab>('position');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-xs font-semibold mb-4">
              <Calculator size={12} /> Tools Trading
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">Kalkulator Trading</h1>
            <p className="text-[#8BA8C2] max-w-xl mx-auto">
              Kalkulator gratis untuk manajemen risiko, position sizing, profit/loss, dan perencanaan modal. Semua perhitungan dilakukan di perangkatmu.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap justify-center mb-8">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab === id ? 'bg-[#00D4FF] text-[#060B18]' : 'bg-white/5 text-[#8BA8C2] hover:text-white border border-white/8'
                }`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          {/* Kalkulator aktif */}
          <div className="p-6 rounded-2xl glass border border-white/8">
            {tab === 'position' && <PositionSizing />}
            {tab === 'rr' && <RiskReward />}
            {tab === 'pnl' && <ProfitLoss />}
            {tab === 'compound' && <Compounding />}
          </div>

          {/* CTA ke sinyal */}
          <div className="mt-8 p-6 rounded-2xl glass border border-[#00D4FF]/20 text-center">
            <h3 className="text-white font-bold text-lg mb-2">Sudah hitung risikomu?</h3>
            <p className="text-[#8BA8C2] text-sm mb-4">Dapatkan sinyal trading otomatis dengan entry, target, dan stop-loss yang sudah dihitung.</p>
            <a href="/signals" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-all">
              Lihat Sinyal Trading <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
