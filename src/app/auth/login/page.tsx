'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authAPI.login(form.email, form.password);
      setToken(res.data.token);
      setUser(res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Email atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex overflow-hidden">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00D4FF]/8 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-[#7B2FFF]/10 blur-[80px] rounded-full" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E676]/10 border border-[#00E676]/25 text-[#00E676] text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
            Signal Engine Aktif 24/7
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Sinyal Trading<br />
            <span className="bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] bg-clip-text text-transparent">Real-Time</span>
          </h2>
          <p className="text-[#8BA8C2] text-sm max-w-xs mx-auto">RSI · MACD · Bollinger Bands · EMA · Auto SL/TP</p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-xs mx-auto">
            {[
              { label: 'Instrumen', value: '150+' },
              { label: 'Update', value: '5 menit' },
              { label: 'Sinyal/hari', value: '20-50' },
              { label: 'Akurasi', value: '78%+' },
            ].map((s) => (
              <div key={s.label} className="p-3 rounded-xl glass border border-white/8 text-center">
                <p className="font-mono font-bold text-[#00D4FF] text-lg">{s.value}</p>
                <p className="text-[#4A6080] text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 lg:max-w-md flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center">
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <span className="font-display font-black text-base">
              <span className="text-[#00D4FF]">TRADE</span><span className="text-white">SIGNAL</span>
              <span className="text-[#7B2FFF] text-[10px] ml-1 font-mono">PRO</span>
            </span>
          </Link>

          <h1 className="text-2xl font-display font-bold text-white mb-1">Selamat datang kembali</h1>
          <p className="text-[#8BA8C2] text-sm mb-8">Masuk ke akun TradeSignal Pro kamu</p>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#FF4757]/8 border border-[#FF4757]/25 text-[#FF4757] text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4757] shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#8BA8C2] text-[11px] font-bold mb-2 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6080]" />
                <input type="email" value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder-[#4A6080] focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="email@kamu.com" />
              </div>
            </div>

            <div>
              <label className="block text-[#8BA8C2] text-[11px] font-bold mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6080]" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white text-sm placeholder-[#4A6080] focus:outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(0,212,255,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#4A6080] hover:text-[#8BA8C2] transition-colors">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white relative overflow-hidden group disabled:opacity-60 transition-all mt-2">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#7B2FFF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Masuk</span><ArrowRight size={14} /></>
                }
              </span>
            </button>
          </form>

          <p className="text-center text-[#8BA8C2] text-sm mt-6">
            Belum punya akun?{' '}
            <Link href="/auth/register" className="text-[#00D4FF] font-semibold hover:underline">Daftar Gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
