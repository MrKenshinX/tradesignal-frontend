'use client';
import { useState } from 'react';
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { KeyRound, Loader2, ArrowLeft, MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Gagal mengirim email. Coba lagi nanti.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060B18] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl glass border border-white/8 p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#00E676]/15 flex items-center justify-center mx-auto mb-4">
                <MailCheck size={26} className="text-[#00E676]" />
              </div>
              <h1 className="text-xl font-display font-bold text-white">Cek Email Kamu</h1>
              <p className="text-[#8BA8C2] text-sm mt-2">
                Jika email <span className="text-white">{email}</span> terdaftar, link reset password sudah dikirim. Link berlaku 1 jam.
              </p>
              <Link href="/auth/login"
                className="inline-flex items-center gap-1.5 mt-6 text-[#00D4FF] text-sm hover:underline">
                <ArrowLeft size={14} /> Kembali ke Login
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center mb-4">
                  <KeyRound size={26} className="text-white" />
                </div>
                <h1 className="text-xl font-display font-bold text-white">Lupa Password?</h1>
                <p className="text-[#8BA8C2] text-sm mt-1 text-center">
                  Masukkan email kamu, kami kirimkan link untuk reset password.
                </p>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757] text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none transition-colors"
                    placeholder="email@kamu.com"
                  />
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>

              <Link href="/auth/login"
                className="flex items-center justify-center gap-1.5 mt-6 text-[#8BA8C2] text-sm hover:text-white transition-colors">
                <ArrowLeft size={14} /> Kembali ke Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
