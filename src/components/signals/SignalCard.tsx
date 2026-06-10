'use client';
import { Signal, signalLabel, marketLabel } from '@/types';
import { Shield, Target, Clock, ExternalLink, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface Props {
  signal: Signal;
}

export function SignalCard({ signal }: Props) {
  const action = signalLabel(signal.signal_type);
  const market = marketLabel(signal.category);
  const isBuy = action === 'BUY';
  const isSell = action === 'SELL';
  const isStrong = signal.signal_type === 'strong_buy' || signal.signal_type === 'strong_sell';
  const confidence = signal.confidence ?? 0;
  const isIDN = signal.category === 'idn';

  const borderCls = isBuy
    ? 'border-[#00E676]/20 hover:border-[#00E676]/40 hover:shadow-[0_0_30px_rgba(0,230,118,0.12)]'
    : isSell
    ? 'border-[#FF4757]/20 hover:border-[#FF4757]/40 hover:shadow-[0_0_30px_rgba(255,71,87,0.12)]'
    : 'border-[#FFD700]/20 hover:border-[#FFD700]/40';

  const confColor = confidence >= 80 ? 'text-[#00E676]' : confidence >= 60 ? 'text-[#FFD700]' : 'text-[#FF4757]';

  const rsiColor = signal.rsi
    ? signal.rsi < 30 ? 'text-[#00E676]'
    : signal.rsi > 70 ? 'text-[#FF4757]'
    : 'text-[#8BA8C2]'
    : 'text-[#4A6080]';

  return (
    <div className={`relative p-5 rounded-2xl glass border ${borderCls} transition-all duration-300 hover:scale-[1.01] group`}
      style={{ background: 'rgba(6,11,24,0.6)', backdropFilter: 'blur(12px)' }}>

      {/* Strong signal top bar */}
      {isStrong && (
        <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl ${
          isBuy ? 'bg-gradient-to-r from-transparent via-[#00E676] to-transparent'
          : 'bg-gradient-to-r from-transparent via-[#FF4757] to-transparent'
        }`} />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-mono font-black text-base text-white tracking-wide">{signal.symbol}</span>
            <span className="text-[9px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded border border-white/8">{market}</span>
            {isStrong && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                isBuy ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
                : 'bg-[#FF4757]/15 text-[#FF4757] border border-[#FF4757]/30'
              }`}>⚡ STRONG</span>
            )}
          </div>
          {signal.name && signal.name !== signal.symbol && (
            <p className="text-[#4A6080] text-[10px] truncate max-w-[140px]">{signal.name}</p>
          )}
        </div>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
          isBuy ? 'signal-buy' : isSell ? 'signal-sell' : 'signal-hold'
        }`}>{action}</span>
      </div>

      {/* Price */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[#4A6080] text-[9px] uppercase tracking-wider mb-0.5">Entry Price</p>
          <p className="font-mono font-black text-xl text-white">
            {signal.price_entry != null
              ? signal.price_entry.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#4A6080] text-[9px] uppercase tracking-wider mb-0.5">Confidence</p>
          <p className={`font-mono font-black text-xl ${confColor}`}>
            {confidence > 0 ? `${confidence}%` : '—'}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      {confidence > 0 && (
        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
          <div className={`h-full rounded-full transition-all duration-700 ${
            isBuy ? 'bg-gradient-to-r from-[#00E676]/60 to-[#00E676]'
            : isSell ? 'bg-gradient-to-r from-[#FF4757]/60 to-[#FF4757]'
            : 'bg-[#FFD700]'
          }`} style={{ width: `${confidence}%` }} />
        </div>
      )}

      {/* SL/TP */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-xl bg-[#FF4757]/6 border border-[#FF4757]/12">
          <div className="flex items-center gap-1 mb-1">
            <Shield size={9} className="text-[#FF4757]" />
            <span className="text-[8px] text-[#FF4757] font-bold uppercase tracking-wider">Stop Loss</span>
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {signal.price_stop_loss != null
              ? signal.price_stop_loss.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#00E676]/6 border border-[#00E676]/12">
          <div className="flex items-center gap-1 mb-1">
            <Target size={9} className="text-[#00E676]" />
            <span className="text-[8px] text-[#00E676] font-bold uppercase tracking-wider">Take Profit</span>
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {signal.price_target != null
              ? signal.price_target.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </span>
        </div>
      </div>

      {/* Indicators */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { label: 'RSI', value: signal.rsi?.toFixed(0), color: rsiColor },
          { label: 'ADX', value: signal.adx?.toFixed(0), color: 'text-[#8BA8C2]' },
          { label: 'Score', value: signal.score?.toString(), color: 'text-[#7B2FFF]' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-1.5 rounded-lg bg-white/3 border border-white/5 text-center">
            <p className="text-[8px] text-[#4A6080] mb-0.5">{label}</p>
            <p className={`font-mono text-[10px] font-bold ${color}`}>{value ?? '—'}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
        <div className="flex items-center gap-1 text-[#4A6080] text-[9px] font-mono">
          <Clock size={9} />
          {new Date(signal.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
          <span className="ml-1 bg-white/5 px-1 rounded">{signal.timeframe}</span>
        </div>
        {isIDN && (
          <a href="https://ajaib.onelink.me/SIjL/q0at7dq2" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[9px] text-[#00D4FF] hover:text-white transition-colors font-bold">
            Beli di Ajaib <ExternalLink size={8} />
          </a>
        )}
      </div>
    </div>
  );
}
