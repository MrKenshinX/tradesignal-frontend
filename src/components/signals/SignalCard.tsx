'use client';
import Link from 'next/link';
import { Signal, signalLabel, marketLabel } from '@/types';
import { TrendingUp, TrendingDown, Shield, Target, Clock, ExternalLink, BarChart2 } from 'lucide-react';

interface Props {
  signal: Signal;
}

export function SignalCard({ signal }: Props) {
  const action = signalLabel(signal.signal_type);
  const market = marketLabel(signal.category);

  const isBuy = action === 'BUY';
  const isSell = action === 'SELL';
  const isStrongBuy = signal.signal_type === 'strong_buy';
  const isStrongSell = signal.signal_type === 'strong_sell';

  const borderCls = isBuy
    ? 'border-[#00E676]/20 hover:border-[#00E676]/40 hover:shadow-[0_0_20px_rgba(0,230,118,0.15)]'
    : isSell
    ? 'border-[#FF4757]/20 hover:border-[#FF4757]/40 hover:shadow-[0_0_20px_rgba(255,71,87,0.15)]'
    : 'border-[#FFD700]/20 hover:border-[#FFD700]/40';

  const badgeCls = isBuy ? 'signal-buy' : isSell ? 'signal-sell' : 'signal-hold';

  const confidence = signal.confidence ?? 0;
  const confColor =
    confidence >= 80 ? 'text-[#00E676]' :
    confidence >= 60 ? 'text-[#FFD700]' : 'text-[#FF4757]';

  const isIDN = signal.category === 'idn';

  return (
    <div className={`relative p-5 rounded-2xl glass border ${borderCls} transition-all duration-300 hover:scale-[1.01] hover:shadow-card`}>

      {/* Strong signal indicator */}
      {(isStrongBuy || isStrongSell) && (
        <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${isStrongBuy ? 'bg-gradient-to-r from-transparent via-[#00E676] to-transparent' : 'bg-gradient-to-r from-transparent via-[#FF4757] to-transparent'}`} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-base text-white">{signal.symbol}</span>
          <span className="text-[10px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded">{market}</span>
          {(isStrongBuy || isStrongSell) && (
            <span className="text-[9px] font-bold text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-1.5 py-0.5 rounded">STRONG</span>
          )}
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${badgeCls}`}>{action}</span>
      </div>

      {/* Name */}
      {signal.name && signal.name !== signal.symbol && (
        <p className="text-[#4A6080] text-xs mb-2 truncate">{signal.name}</p>
      )}

      {/* Price info */}
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-[#4A6080] text-[10px] mb-0.5">Entry Price</p>
          <p className="font-mono font-bold text-xl text-white">
            {signal.price_entry != null
              ? signal.price_entry.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[#4A6080] text-[10px] mb-0.5">Confidence</p>
          <p className={`font-mono font-bold text-lg ${confColor}`}>
            {confidence > 0 ? `${confidence}%` : '—'}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      {confidence > 0 && (
        <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isBuy ? 'bg-gradient-to-r from-[#00E676] to-[#00B85C]'
              : isSell ? 'bg-gradient-to-r from-[#FF4757] to-[#CC3344]'
              : 'bg-[#FFD700]'
            }`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      )}

      {/* SL / TP */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-[#FF4757]/8 border border-[#FF4757]/15">
          <div className="flex items-center gap-1 mb-0.5">
            <Shield size={10} className="text-[#FF4757]" />
            <span className="text-[9px] text-[#FF4757] font-semibold uppercase tracking-wider">Stop Loss</span>
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {signal.price_stop_loss != null
              ? signal.price_stop_loss.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </span>
        </div>
        <div className="p-2 rounded-lg bg-[#00E676]/8 border border-[#00E676]/15">
          <div className="flex items-center gap-1 mb-0.5">
            <Target size={10} className="text-[#00E676]" />
            <span className="text-[9px] text-[#00E676] font-semibold uppercase tracking-wider">Take Profit</span>
          </div>
          <span className="font-mono text-xs font-bold text-white">
            {signal.price_target != null
              ? signal.price_target.toLocaleString('id-ID', { maximumFractionDigits: 4 })
              : '—'}
          </span>
        </div>
      </div>

      {/* Indicators row */}
      <div className="flex gap-3 mb-3 text-[10px] font-mono">
        {signal.rsi != null && (
          <span className={`${signal.rsi < 30 ? 'text-[#00E676]' : signal.rsi > 70 ? 'text-[#FF4757]' : 'text-[#8BA8C2]'}`}>
            RSI <span className="font-bold">{signal.rsi.toFixed(1)}</span>
          </span>
        )}
        {signal.adx != null && (
          <span className="text-[#8BA8C2]">ADX <span className="font-bold text-white">{signal.adx.toFixed(1)}</span></span>
        )}
        {signal.score > 0 && (
          <span className="text-[#8BA8C2]">Score <span className="font-bold text-[#7B2FFF]">{signal.score}</span></span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1 text-[#4A6080] text-[10px] font-mono">
          <Clock size={10} />
          {new Date(signal.updated_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-2">
          {isIDN && (
            <a
              href="https://ajaib.onelink.me/SIjL/q0at7dq2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] text-[#00D4FF] hover:text-white transition-colors font-semibold"
            >
              Beli di Ajaib <ExternalLink size={9} />
            </a>
          )}
          <span className="text-[#4A6080] text-[10px] font-mono">{signal.timeframe}</span>
        </div>
      </div>
    </div>
  );
}
