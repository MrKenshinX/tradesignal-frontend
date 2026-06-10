'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SWRProvider } from '@/components/providers/SWRProvider';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { usePortfolio } from '@/hooks/useMarketData';
import { TrendingUp, TrendingDown, BarChart2, Plus } from 'lucide-react';
import Link from 'next/link';

function PortfolioContent() {
  const { data: positions, isLoading } = usePortfolio();
  const openPositions = (positions ?? []).filter(p => p.status === 'open');

  return (
    <div className="min-h-screen bg-[#060B18] pt-16">
      <div className="border-b border-white/5 bg-[#0A1128]/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <BarChart2 size={22} className="text-[#7B2FFF]" /> Portfolio
              </h1>
              <p className="text-[#8BA8C2] text-sm mt-1">{openPositions.length} posisi terbuka</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table */}
        <div className="rounded-2xl glass border border-white/8 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5">
            <h3 className="text-white font-semibold text-sm">Posisi Terbuka</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['Symbol', 'Market', 'Qty', 'Buy Price', 'Target', 'Stop Loss', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-white/3">
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  : openPositions.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12">
                        <div className="text-[#4A6080] text-sm">
                          <BarChart2 size={32} className="mx-auto mb-3 opacity-20" />
                          <p>Belum ada posisi terbuka</p>
                          <p className="text-xs mt-1">Gunakan sinyal dari dashboard untuk mulai trading</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : openPositions.map((pos) => (
                    <tr key={pos.id} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-sm text-white">{pos.symbol}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-mono text-[#4A6080] bg-white/5 px-1.5 py-0.5 rounded uppercase">{pos.category}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-white">
                        {pos.quantity.toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 font-mono text-sm text-white">
                        {pos.buy_price.toLocaleString('id-ID', { maximumFractionDigits: 4 })}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#00E676]">
                          {pos.target_price != null
                            ? pos.target_price.toLocaleString('id-ID', { maximumFractionDigits: 4 })
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-[#FF4757]">
                          {pos.stop_loss != null
                            ? pos.stop_loss.toLocaleString('id-ID', { maximumFractionDigits: 4 })
                            : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          pos.status === 'open'
                            ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30'
                            : 'bg-white/5 text-[#4A6080] border border-white/10'
                        }`}>
                          {pos.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <SWRProvider>
      <Navbar />
      <PortfolioContent />
      <Footer />
    </SWRProvider>
  );
}
