'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-api';
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminAuth.login(email, password);
      localStorage.setItem('tsp_admin_token', res.data.token);
      localStorage.setItem('tsp_admin', JSON.stringify(res.data.admin));
      router.push('/admin');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message ?? 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl glass border border-white/8 p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF4757] to-[#7B2FFF] flex items-center justify-center mb-4">
              <Shield size={26} className="text-white" />
            </div>
            <h1 className="text-xl font-display font-bold text-white">Admin Panel</h1>
            <p className="text-[#8BA8C2] text-sm mt-1">TradeSignal Pro — Restricted Access</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Email Admin</label>
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#FF4757] focus:outline-none transition-colors"
                placeholder="admin@tradesignalpro.web.id"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#FF4757] focus:outline-none transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8BA8C2] hover:text-white">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF4757] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
            </button>
          </form>

          <p className="text-center text-[#4A6080] text-xs mt-6">
            Akses hanya untuk administrator. Aktivitas dicatat.
          </p>
        </div>
      </div>
    </div>
  );
}
