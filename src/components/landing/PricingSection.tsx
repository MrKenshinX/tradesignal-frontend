'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap, Star, Crown } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

// Map landing plan IDs → upgrade page plan IDs
const PLAN_MAP: Record<string, string> = {
  PREMIUM_IDN: 'idn',
  PREMIUM_ASING: 'asing',
  PREMIUM_CRYPTO: 'crypto',
  VIP: 'vip',
};

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
  const { user } = useAuthStore();

  // Format tanggal berakhir langganan
  const expiryText = (() => {
    if (!user?.subscription_expires) return null;
    const d = new Date(user.subscription_expires);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  // Sisa hari
  const daysLeft = (() => {
    if (!user?.subscription_expires) return null;
    const d = new Date(user.subscription_expires);
    if (isNaN(d.getTime())) return null;
    return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  })();

  const planDisplay: Record<string, string> = {
    free: 'Free', idn: 'Premium IDN', asing: 'Premium Asing', crypto: 'Premium Crypto', vip: 'VIP All-Access',
  };

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
            {user && user.plan !== 'free' ? (
              <>Langganan <span className="bg-gradient-to-r from-[#00E676] to-[#00D4FF] bg-clip-text text-transparent">Aktif</span></>
            ) : (
              <>Mulai Gratis,<br /><span className="bg-gradient-to-r from-[#00E676] to-[#00D4FF] bg-clip-text text-transparent">Upgrade Kapan Saja</span></>
            )}
          </h2>
          <p className="max-w-xl mx-auto text-[#8BA8C2] text-lg">
            {user && user.plan !== 'free'
              ? 'Kelola atau tingkatkan paket langgananmu kapan saja.'
              : 'Pilih paket sesuai kebutuhanmu. Semua paket termasuk akses sinyal real-time dari database kami.'}
          </p>
        </div>

        {/* Banner status langganan untuk user yang sudah berlangganan */}
        {user && user.plan !== 'free' && (
          <div className="max-w-2xl mx-auto mb-12 p-6 rounded-2xl glass border border-[#00E676]/30 bg-[#00E676]/5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#00E676]/10 flex items-center justify-center">
                  <Crown size={24} className="text-[#00E676]" />
                </div>
                <div>
                  <p className="text-[#8BA8C2] text-xs">Paket Aktif</p>
                  <p className="text-white font-bold text-lg">{planDisplay[user.plan] ?? user.plan}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[#8BA8C2] text-xs">Berlaku hingga</p>
                <p className="text-white font-semibold">{expiryText ?? '—'}</p>
                {daysLeft !== null && (
                  <p className={`text-xs mt-0.5 ${daysLeft <= 7 ? 'text-[#FF5252]' : 'text-[#00E676]'}`}>
                    {daysLeft > 0 ? `${daysLeft} hari lagi` : 'Sudah berakhir'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const planKey = PLAN_MAP[plan.id] ?? (plan.id === 'FREE' ? 'free' : '');
            const isCurrentPlan = user && planKey === user.plan;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col p-6 rounded-2xl glass border transition-all duration-300 hover:scale-[1.02] hover:shadow-card ${
                  isCurrentPlan ? 'border-[#00E676] ring-1 ring-[#00E676]/40' : plan.borderColor
                } ${plan.highlighted && !isCurrentPlan ? 'ring-1 ring-[#00D4FF]/30 shadow-glow-cyan-sm' : ''}`}
              >
                {isCurrentPlan ? (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#00E676] text-[#060B18] text-[10px] font-bold whitespace-nowrap">
                    PAKET AKTIF
                  </div>
                ) : plan.badge && (
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

                {isCurrentPlan ? (
                  <div className="block text-center py-2.5 px-4 rounded-xl text-sm bg-[#00E676]/10 text-[#00E676] font-semibold border border-[#00E676]/30 cursor-default">
                    ✓ Paket Aktif
                  </div>
                ) : (
                  <Link
                    href={
                      plan.id === 'FREE'
                        ? (user ? '/dashboard' : '/auth/register')
                        : user
                          ? '/upgrade?plan=' + (PLAN_MAP[plan.id] ?? '')
                          : '/auth/register?plan=' + plan.id
                    }
                    className={`block text-center py-2.5 px-4 rounded-xl text-sm transition-all duration-200 ${plan.ctaClass}`}
                  >
                    {plan.id === 'FREE' && user ? 'Buka Dashboard' : plan.cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-[#4A6080] text-xs mt-8">
          Semua harga dalam Rupiah. Pembayaran via transfer bank BRI. Tidak ada biaya tersembunyi.
        </p>
      </div>
    </section>
  );
}
