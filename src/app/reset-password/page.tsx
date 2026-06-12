'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { ShieldCheck, Loader2, Eye, EyeOff } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password minimal 8 karakter.'); return; }
    if (password !== confirm) { setError('Konfirmasi password tidak cocok.'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax.response?.data?.message ?? 'Token tidak valid atau kadaluarsa.');
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-[#FF4757] text-sm">Link tidak valid — token tidak ditemukan.</p>
        <Link href="/auth/forgot-password" className="text-[#00D4FF] text-sm hover:underline mt-4 inline-block">
          Minta link reset baru →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#00E676]/15 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={26} className="text-[#00E676]" />
        </div>
        <h1 className="text-xl font-display font-bold text-white">Password Berhasil Direset!</h1>
        <p className="text-[#8BA8C2] text-sm mt-2">Mengalihkan ke halaman login...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center mb-4">
          <ShieldCheck size={26} className="text-white" />
        </div>
        <h1 className="text-xl font-display font-bold text-white">Buat Password Baru</h1>
        <p className="text-[#8BA8C2] text-sm mt-1">Minimal 8 karakter.</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757] text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Password Baru</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none pr-12"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8BA8C2] hover:text-white">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Konfirmasi Password</label>
          <input
            type={showPass ? 'text' : 'password'} required value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? 'Menyimpan...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#060B18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl glass border border-white/8 p-8">
          <Suspense fallback={<div className="py-10 text-center"><Loader2 className="animate-spin text-[#00D4FF] inline" size={22} /></div>}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
