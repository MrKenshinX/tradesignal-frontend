'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Star, Crown } from 'lucide-react';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    period: '/selamanya',
    icon: Zap,
    iconColor: 'text-[#8BA8C2]',
    borderColor: 'border-white/10',
    features: [
      'Sinyal IDN terbatas (5/hari)',
      'Market overview IDN',
      'Screener dasar',
      'Edukasi trading gratis',
      'Blog & artikel',
    ],
    cta: 'Mulai Gratis',
    ctaClass: 'border border-white/20 text-white hover:bg-white/5',
  },
  {
    id: 'PREMIUM_IDN',
    name: 'Premium IDN',
    price: 100000,
    period: '/bulan',
    icon: Star,
    iconColor: 'text-[#00D4FF]',
    borderColor: 'border-[#00D4FF]/30',
    badge: 'Populer',
    features: [
      'Sinyal IDN unlimited',
      'Confidence score detail',
      'Auto SL/TP ATR-based',
      'Portfolio tracker IDN',
      'Notifikasi sinyal real-time',
      'Screener IDN canggih',
      'Referral bonus Ajaib',
    ],
    cta: 'Pilih Premium IDN',
    ctaClass: 'bg-gradient-to-r from-[#00D4FF] to-[#00AACC] text-[#060B18] font-bold hover:opacity-90',
    highlighted: true,
  },
  {
    id: 'PREMIUM_ASING',
    name: 'Premium Asing',
    price: 100000,
    period: '/bulan',
    icon: Star,
    iconColor: 'text-[#7B2FFF]',
    borderColor: 'border-[#7B2FFF]/30',
    features: [
      'Sinyal NYSE/NASDAQ unlimited',
      'Confidence score detail',
      'Auto SL/TP ATR-based',
      'Portfolio tracker Asing',
      'Notifikasi sinyal real-time',
      'Screener Asing canggih',
      'Multi-timeframe analysis',
    ],
    cta: 'Pilih Premium Asing',
    ctaClass: 'bg-gradient-to-r from-[#7B2FFF] to-[#6020DD] text-white font-bold hover:opacity-90',
  },
  {
    id: 'PREMIUM_CRYPTO',
    name: 'Premium Crypto',
    price: 100000,
    period: '/bulan',
    icon: Star,
    iconColor: 'text-[#FFD700]',
    borderColor: 'border-[#FFD700]/30',
    features: [
      'Sinyal Crypto Top-50 unlimited',
      'Binance WebSocket real-time',
      'Confidence score detail',
      'Auto SL/TP ATR-based',
      'Portfolio tracker Crypto',
      'Notifikasi sinyal real-time',
      'Heatmap crypto',
    ],
    cta: 'Pilih Premium Crypto',
    ctaClass: 'bg-gradient-to-r from-[#FFD700] to-[#CCAA00] text-[#060B18] font-bold hover:opacity-90',
  },
  {
    id: 'VIP',
    name: 'VIP All-Access',
    price: 250000,
    period: '/bulan',
    icon: Crown,
    iconColor: 'text-[#00E676]',
    borderColor: 'border-[#00E676]/40',
    badge: 'Best Value',
    features: [
      'Semua sinyal IDN + Asing + Crypto',
      'Priority signal alerts',
      'Advanced screener semua market',
      'Portfolio tracker semua market',
      'Dedicated support',
      'API access (coming soon)',
      'Early access fitur baru',
    ],
    cta: 'Pilih VIP',
    ctaClass: 'bg-gradient-to-r from-[#00E676] to-[#00B85C] text-[#060B18] font-bold hover:opacity-90 shadow-glow-green',
  },
];

export function PricingSection() {
  return (
    <section className="relative py-24 bg-[#060B18]" id="pricing">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-64 h-64 bg-[#00D4FF]/5 blur-[80px] rounded-full" />
      <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-[#7B2FFF]/5 blur-[80px] rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676] text-xs font-semibold mb-4">
            <Crown size={12} /> Harga & Paket
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            Mulai Gratis,<br />
            <span className="bg-gradient-to-r from-[#00E676] to-[#00D4FF] bg-clip-text text-transparent">Upgrade Kapan Saja</span>
          </h2>
          <p className="max-w-xl mx-auto text-[#8BA8C2] text-lg">
            Pilih paket sesuai kebutuhanmu. Semua paket termasuk akses sinyal real-time dari database Supabase kami.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-6 rounded-2xl glass border ${plan.borderColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-card ${
                  plan.highlighted ? 'ring-1 ring-[#00D4FF]/30 shadow-glow-cyan-sm' : ''
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-[10px] font-bold whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}

                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3`}>
                    <Icon size={20} className={plan.iconColor} />
                  </div>
                  <h3 className="text-white font-bold text-base mb-1">{plan.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="font-display font-bold text-2xl text-white">
                      {plan.price === 0 ? 'Rp 0' : `Rp ${(plan.price / 1000).toFixed(0)}K`}
                    </span>
                    <span className="text-[#8BA8C2] text-xs pb-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-[#8BA8C2]">
                      <Check size={13} className="text-[#00E676] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === 'FREE' ? '/auth/register' : '/auth/register?plan=' + plan.id}
                  className={`block text-center py-2.5 px-4 rounded-xl text-sm transition-all duration-200 ${plan.ctaClass}`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-[#4A6080] text-xs mt-8">
          Semua harga dalam Rupiah. Pembayaran via transfer bank / e-wallet. Tidak ada biaya tersembunyi.
        </p>
      </div>
    </section>
  );
}
