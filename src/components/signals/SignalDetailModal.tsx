'use client';
import { useEffect, useRef } from 'react';
import { Signal, signalLabel, marketLabel } from '@/types';
import { X, Shield, Target, TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';

interface Props {
  signal: Signal | null;
  onClose: () => void;
}

// Map symbol + kategori → format simbol TradingView
function tvSymbol(signal: Signal): string {
  const s = signal.symbol.toUpperCase();
  if (signal.category === 'idn') return `IDX:${s}`;
  if (signal.category === 'crypto') {
    // Crypto biasanya sudah pakai pair (BTCUSDT) atau perlu ditambah
    const sym = s.endsWith('USDT') || s.endsWith('USD') ? s : `${s}USDT`;
    return `BINANCE:${sym}`;
  }
  // asing (US stocks) — TradingView pilih exchange otomatis tanpa prefix
  return s;
}

// Bangun daftar alasan dari indikator yang sudah dihitung engine
function buildReasons(signal: Signal): { text: string; tone: 'bull' | 'bear' | 'neutral' }[] {
  const reasons: { text: string; tone: 'bull' | 'bear' | 'neutral' }[] = [];
  const rsi = signal.rsi != null ? Number(signal.rsi) : null;
  const adx = signal.adx != null ? Number(signal.adx) : null;

  if (rsi != null) {
    if (rsi < 30) reasons.push({ text: `RSI ${rsi.toFixed(0)} — area oversold (jenuh jual), potensi pantulan naik`, tone: 'bull' });
    else if (rsi < 40) reasons.push({ text: `RSI ${rsi.toFixed(0)} — mendekati oversold, momentum mulai melemah di sisi jual`, tone: 'bull' });
    else if (rsi > 70) reasons.push({ text: `RSI ${rsi.toFixed(0)} — area overbought (jenuh beli), potensi koreksi turun`, tone: 'bear' });
    else if (rsi > 60) reasons.push({ text: `RSI ${rsi.toFixed(0)} — mendekati overbought, hati-hati tekanan jual`, tone: 'bear' });
    else reasons.push({ text: `RSI ${rsi.toFixed(0)} — netral`, tone: 'neutral' });
  }

  if (signal.macd) {
    if (signal.macd.toLowerCase() === 'bullish') reasons.push({ text: 'MACD bullish — momentum tren naik', tone: 'bull' });
    else if (signal.macd.toLowerCase() === 'bearish') reasons.push({ text: 'MACD bearish — momentum tren turun', tone: 'bear' });
  }

  if (signal.bb_position) {
    const bb = signal.bb_position.toLowerCase();
    if (bb.includes('lower')) reasons.push({ text: 'Harga di area lower Bollinger Band — relatif murah, potensi rebound', tone: 'bull' });
    else if (bb.includes('upper')) reasons.push({ text: 'Harga di area upper Bollinger Band — relatif mahal, potensi pullback', tone: 'bear' });
  }

  if (adx != null) {
    if (adx >= 25) reasons.push({ text: `ADX ${adx.toFixed(0)} — tren kuat, sinyal lebih dapat diandalkan`, tone: 'neutral' });
    else reasons.push({ text: `ADX ${adx.toFixed(0)} — tren lemah/sideways, sinyal kurang kuat`, tone: 'neutral' });
  }

  return reasons;
}

export function SignalDetailModal({ signal, onClose }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!signal) return;
    // Escape untuk tutup
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [signal, onClose]);

  useEffect(() => {
    if (!signal || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol(signal),
      interval: 'D',
      timezone: 'Asia/Jakarta',
      theme: 'dark',
      style: '1',
      locale: 'id',
      enable_publishing: false,
      hide_side_toolbar: true,
      allow_symbol_change: false,
      backgroundColor: 'rgba(6,11,24,1)',
      gridColor: 'rgba(255,255,255,0.06)',
      studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
    });
    container.appendChild(script);
  }, [signal]);

  if (!signal) return null;

  const action = signalLabel(signal.signal_type);
  const isBuy = action === 'BUY';
  const isSell = action === 'SELL';
  const market = marketLabel(signal.category);
  const reasons = buildReasons(signal);
  const confidence = Number(signal.confidence ?? 0);

  const actionColor = isBuy ? 'text-[#00E676]' : isSell ? 'text-[#FF4757]' : 'text-[#FFD700]';
  const actionBg = isBuy ? 'bg-[#00E676]/15 border-[#00E676]/30' : isSell ? 'bg-[#FF4757]/15 border-[#FF4757]/30' : 'bg-[#FFD700]/15 border-[#FFD700]/30';

  const fmt = (v: number | null | undefined) =>
    v != null ? Number(v).toLocaleString('id-ID', { maximumFractionDigits: 4 }) : '—';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#060B18] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-white/10 bg-[#060B18]">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-xl text-white">{signal.symbol}</span>
            <span className="text-[10px] font-mono text-[#4A6080] bg-white/5 px-2 py-0.5 rounded border border-white/8">{market}</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-lg border ${actionBg} ${actionColor}`}>
              {action} {confidence > 0 && `· ${confidence}%`}
            </span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-[#8BA8C2] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* TradingView Chart */}
          <div className="rounded-xl overflow-hidden border border-white/8" style={{ height: '400px' }}>
            <div ref={containerRef} className="tradingview-widget-container" style={{ height: '100%', width: '100%' }} />
          </div>

          {/* Entry / SL / TP */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-[#4A6080] text-[10px] uppercase tracking-wider mb-1">Entry</p>
              <p className="font-mono font-bold text-white">{fmt(signal.price_entry)}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#FF4757]/6 border border-[#FF4757]/15">
              <div className="flex items-center gap-1 mb-1">
                <Shield size={10} className="text-[#FF4757]" />
                <p className="text-[#FF4757] text-[10px] uppercase tracking-wider">Stop Loss</p>
              </div>
              <p className="font-mono font-bold text-white">{fmt(signal.price_stop_loss)}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#00E676]/6 border border-[#00E676]/15">
              <div className="flex items-center gap-1 mb-1">
                <Target size={10} className="text-[#00E676]" />
                <p className="text-[#00E676] text-[10px] uppercase tracking-wider">Take Profit</p>
              </div>
              <p className="font-mono font-bold text-white">{fmt(signal.price_target)}</p>
            </div>
          </div>

          {/* Alasan sinyal */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info size={16} className="text-[#00D4FF]" />
              <h3 className="text-white font-bold">Kenapa sinyal ini {action}?</h3>
            </div>
            <div className="space-y-2">
              {reasons.length > 0 ? reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-white/3 border border-white/5">
                  {r.tone === 'bull' ? <TrendingUp size={16} className="text-[#00E676] mt-0.5 shrink-0" />
                    : r.tone === 'bear' ? <TrendingDown size={16} className="text-[#FF4757] mt-0.5 shrink-0" />
                    : <Activity size={16} className="text-[#8BA8C2] mt-0.5 shrink-0" />}
                  <p className="text-[#C5D5E8] text-sm">{r.text}</p>
                </div>
              )) : (
                <p className="text-[#8BA8C2] text-sm">Data indikator tidak lengkap untuk sinyal ini.</p>
              )}
            </div>

            {/* Indikator ringkas */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[
                { label: 'RSI', value: signal.rsi != null ? Number(signal.rsi).toFixed(0) : '—' },
                { label: 'ADX', value: signal.adx != null ? Number(signal.adx).toFixed(0) : '—' },
                { label: 'Score', value: signal.score?.toString() ?? '—' },
                { label: 'R:R', value: (signal.price_target != null && signal.price_stop_loss != null && signal.price_entry != null)
                  ? (Math.abs(Number(signal.price_target) - Number(signal.price_entry)) / Math.max(0.0001, Math.abs(Number(signal.price_entry) - Number(signal.price_stop_loss)))).toFixed(1)
                  : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="p-2 rounded-lg bg-white/3 border border-white/5 text-center">
                  <p className="text-[9px] text-[#4A6080] mb-0.5">{label}</p>
                  <p className="font-mono text-sm font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[#4A6080] text-[11px] text-center pt-2 border-t border-white/5">
            Sinyal ini dihasilkan otomatis dari analisis teknikal & bukan rekomendasi keuangan.
            Selalu lakukan riset sendiri sebelum berinvestasi.
          </p>
        </div>
      </div>
    </div>
  );
}
