'use client';
import { AnimatedCounter } from './AnimatedCounter';
import { Zap, TrendingUp, Users, Clock } from 'lucide-react';

const STATS = [
  { label: 'Sinyal Dihasilkan', value: 50000, suffix: '+', prefix: '', icon: Zap, color: 'cyan' },
  { label: 'Instrumen Dipantau', value: 150, suffix: '+', prefix: '', icon: TrendingUp, color: 'purple' },
  { label: 'Trader Aktif', value: 3200, suffix: '+', prefix: '', icon: Users, color: 'green' },
  { label: 'Uptime Sistem', value: 99.9, suffix: '%', prefix: '', decimals: 1, icon: Clock, color: 'gold' },
];

const colorMap: Record<string, string> = {
  cyan: 'text-[#00D4FF] shadow-[0_0_20px_rgba(0,212,255,0.3)] border-[#00D4FF]/20 bg-[#00D4FF]/5',
  purple: 'text-[#7B2FFF] shadow-[0_0_20px_rgba(123,47,255,0.3)] border-[#7B2FFF]/20 bg-[#7B2FFF]/5',
  green: 'text-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.3)] border-[#00E676]/20 bg-[#00E676]/5',
  gold: 'text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.3)] border-[#FFD700]/20 bg-[#FFD700]/5',
};

export function StatsSection() {
  return (
    <section className="relative py-20 bg-[#060B18]">
      <div className="absolute inset-0 bg-grid-sm opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            const cls = colorMap[stat.color];
            return (
              <div
                key={stat.label}
                className="relative p-6 rounded-2xl glass border border-white/8 hover:border-[#00D4FF]/20 transition-all duration-300 group hover:scale-[1.02] hover:shadow-card"
              >
                <div className={`w-10 h-10 rounded-xl border ${cls} flex items-center justify-center mb-4`}>
                  <Icon size={18} />
                </div>
                <div className={`font-display font-bold text-3xl sm:text-4xl mb-1 ${cls.split(' ')[0]}`}>
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <p className="text-[#8BA8C2] text-sm">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
