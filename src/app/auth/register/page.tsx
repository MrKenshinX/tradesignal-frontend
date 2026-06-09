'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock, User, Check } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

const PLAN_LABELS: Record<string, string> = {
  PREMIUM_IDN: 'Premium IDN — Rp100K/bulan',
  PREMIUM_ASING: 'Premium Asing — Rp100K/bulan',
  PREMIUM_CRYPTO: 'Premium Crypto — Rp100K/bulan',
  VIP: 'VIP All-Access — Rp250K/bulan',
};

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan');
  const { setToken, setUser } = useAuthStore();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.register(form);
      setToken(res.data.token);
      setUser(res.data.user);
      router.push(plan ? `/upgrade?plan=${plan}` : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Pendaftaran gagal, coba lagi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#7B2FFF]/6 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center shadow-glow-cyan">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="text-[#00D4FF]">TRADE</span><span className="text-white">SIGNAL</span>
              <span className="text-[#7B2FFF] text-xs ml-1">PRO</span>
            </span>
          </Link>
          <p className="text-[#8BA8C2] text-sm mt-3">Buat akun gratis kamu</p>
        </div>

        {plan && PLAN_LABELS[plan] && (
          <div className="mb-4 p-3 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-center">
            <p className="text-[#8BA8C2] text-xs">Kamu akan upgrade ke</p>
            <p className="text-[#00D4FF] text-sm font-bold mt-0.5">{PLAN_LABELS[plan]}</p>
            <p className="text-[#4A6080] text-xs mt-0.5">setelah registrasi selesai</p>
          </div>
        )}

        <div className="glass border border-[#7B2FFF]/20 rounded-2xl p-6 shadow-card">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6080]" />
                <input type="text" value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#7B2FFF]/50 focus:bg-[#7B2FFF]/5 transition-all"
                  placeholder="Nama kamu" />
              </div>
            </div>

            <div>
              <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6080]" />
                <input type="email" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#7B2FFF]/50 focus:bg-[#7B2FFF]/5 transition-all"
                  placeholder="email@kamu.com" />
              </div>
            </div>

            <div>
              <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4A6080]" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required minLength={8}
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#7B2FFF]/50 focus:bg-[#7B2FFF]/5 transition-all"
                  placeholder="Min. 8 karakter" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6080] hover:text-[#8BA8C2]">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-[#8BA8C2]">
              <Check size={12} className="text-[#00E676] mt-0.5 shrink-0" />
              <span>Dengan mendaftar, kamu menyetujui <Link href="/terms" className="text-[#00D4FF] hover:underline">Syarat & Ketentuan</Link> kami</span>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-glow-purple">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Daftar Gratis <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-white/5 text-center">
            <p className="text-[#8BA8C2] text-xs">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-[#00D4FF] font-semibold hover:underline">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
