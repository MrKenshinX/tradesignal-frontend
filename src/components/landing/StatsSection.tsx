'use client';
import { AnimatedCounter } from './AnimatedCounter';
import { Zap, TrendingUp, Users, Activity } from 'lucide-react';

const STATS = [
  { label: 'Sinyal Dihasilkan', value: 50000, suffix: '+', icon: Zap, color: '#00D4FF', glow: 'rgba(0,212,255,0.2)' },
  { label: 'Instrumen Dipantau', value: 150, suffix: '+', icon: TrendingUp, color: '#7B2FFF', glow: 'rgba(123,47,255,0.2)' },
  { label: 'Trader Aktif', value: 3200, suffix: '+', icon: Users, color: '#00E676', glow: 'rgba(0,230,118,0.2)' },
  { label: 'Uptime Sistem', value: 99.9, suffix: '%', decimals: 1, icon: Activity, color: '#FFD700', glow: 'rgba(255,215,0,0.2)' },
];

export function StatsSection() {
  return (
    <section className="relative py-16 bg-[#060B18]">
      <div className="absolute inset-0 bg-grid-sm opacity-15 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label}
                className="relative p-6 rounded-2xl overflow-hidden group hover:scale-[1.03] transition-all duration-300 cursor-default"
                style={{ background: 'rgba(10,17,40,0.6)', border: `1px solid rgba(255,255,255,0.06)`, backdropFilter: 'blur(12px)' }}>

                {/* Glow bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${stat.glow}, transparent 70%)` }} />

                {/* Icon */}
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>

                {/* Value */}
                <div className="relative font-display font-black text-3xl sm:text-4xl mb-1"
                  style={{ color: stat.color }}>
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} decimals={stat.decimals || 0} />
                </div>

                <p className="relative text-[#8BA8C2] text-sm">{stat.label}</p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
