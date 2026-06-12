'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { paymentAPI, type PaymentOrder, type PaymentHistory } from '@/lib/api';
import {
  Crown, Check, Copy, Upload, Loader2, Clock, CheckCircle2, XCircle, FileImage,
} from 'lucide-react';

// ⚠️ GANTI dengan rekening asli kamu
const BANK_ACCOUNTS = [
  { bank: 'BCA', number: '1234567890', name: 'Nama Pemilik Rekening' },
  { bank: 'DANA / OVO / GoPay', number: '0812-xxxx-xxxx', name: 'Nama Pemilik' },
];

const PLANS = [
  { id: 'idn', name: 'Premium IDN', price: 100000, period: '/bulan', features: ['Sinyal IDN unlimited', 'Auto SL/TP ATR-based', 'Portfolio tracker', 'Notifikasi real-time'] },
  { id: 'asing', name: 'Premium Asing', price: 100000, period: '/bulan', features: ['Sinyal NYSE/NASDAQ unlimited', 'Auto SL/TP ATR-based', 'Portfolio tracker', 'Multi-timeframe'] },
  { id: 'crypto', name: 'Premium Crypto', price: 100000, period: '/bulan', features: ['Sinyal Crypto Top-50', 'Binance WebSocket', 'Auto SL/TP ATR-based', 'Heatmap crypto'] },
  { id: 'vip', name: 'VIP All-Access', price: 250000, period: '/bulan', popular: true, features: ['Semua market IDN+Asing+Crypto', 'Priority alerts', 'Advanced screener', 'Dedicated support'] },
  { id: 'vip3', name: 'VIP 3 Bulan', price: 625000, period: '/3 bulan', save: 'Hemat Rp 125K', features: ['Semua benefit VIP', '3 bulan akses penuh', 'Harga lebih hemat', 'Prioritas fitur baru'] },
];

const fmtIDR = (n: number | string) => 'Rp ' + Number(n).toLocaleString('id-ID');
const STATUS_INFO: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
  pending: { label: 'Menunggu Pembayaran', cls: 'bg-[#FFD700]/15 text-[#FFD700]', icon: <Clock size={12} /> },
  uploaded: { label: 'Menunggu Konfirmasi', cls: 'bg-[#00D4FF]/15 text-[#00D4FF]', icon: <Clock size={12} /> },
  success: { label: 'Berhasil', cls: 'bg-[#00E676]/15 text-[#00E676]', icon: <CheckCircle2 size={12} /> },
  rejected: { label: 'Ditolak', cls: 'bg-[#FF4757]/15 text-[#FF4757]', icon: <XCircle size={12} /> },
  expired: { label: 'Kadaluarsa', cls: 'bg-white/10 text-[#8BA8C2]', icon: <XCircle size={12} /> },
};

function UpgradeContent() {
  const searchParams = useSearchParams();
  const preselect = searchParams.get('plan');

  const [step, setStep] = useState<'choose' | 'pay'>('choose');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [creating, setCreating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [metode, setMetode] = useState('Transfer Bank');
  const [catatan, setCatatan] = useState('');
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [copied, setCopied] = useState('');

  const loadHistory = useCallback(async () => {
    try { setHistory(await paymentAPI.history()); } catch { /* */ }
  }, []);
  useEffect(() => { loadHistory(); }, [loadHistory]);

  useEffect(() => {
    if (preselect && PLANS.some(p => p.id === preselect)) setSelectedPlan(preselect);
  }, [preselect]);

  const createOrder = async (planId: string) => {
    setCreating(true);
    setMsg(null);
    try {
      const o = await paymentAPI.createOrder(planId);
      setOrder(o);
      setSelectedPlan(planId);
      setStep('pay');
    } catch {
      setMsg({ type: 'err', text: 'Gagal membuat order. Coba lagi.' });
    }
    setCreating(false);
  };

  const submitBukti = async () => {
    if (!order || !file) { setMsg({ type: 'err', text: 'Pilih file bukti transfer dulu.' }); return; }
    setUploading(true);
    setMsg(null);
    try {
      const res = await paymentAPI.uploadBukti(order.order_id, file, metode, catatan);
      setMsg({ type: 'ok', text: res.data.message });
      setStep('choose'); setOrder(null); setFile(null); setCatatan('');
      await loadHistory();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setMsg({ type: 'err', text: ax.response?.data?.message ?? 'Gagal upload bukti.' });
    }
    setUploading(false);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(''), 1500);
  };

  const plan = PLANS.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-[#060B18]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <div className="flex items-center gap-3 mb-2">
          <Crown size={22} className="text-[#FFD700]" />
          <h1 className="text-2xl font-display font-bold text-white">Upgrade Plan</h1>
        </div>
        <p className="text-[#8BA8C2] text-sm mb-8">Pembayaran via transfer manual — dikonfirmasi admin maksimal 1×24 jam.</p>

        {msg && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            msg.type === 'ok' ? 'bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676]'
              : 'bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757]'}`}>
            {msg.text}
          </div>
        )}

        {step === 'choose' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {PLANS.map((p) => (
                <div key={p.id} className={`relative rounded-2xl glass border p-5 flex flex-col ${
                  p.popular ? 'border-[#7B2FFF]/50' : 'border-white/8'}`}>
                  {p.popular && (
                    <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white text-[10px] font-bold">
                      POPULER
                    </span>
                  )}
                  {p.save && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#00E676]/20 text-[#00E676] text-[10px] font-bold">
                      {p.save}
                    </span>
                  )}
                  <h3 className="text-white font-display font-bold">{p.name}</h3>
                  <p className="mt-2 mb-4">
                    <span className="text-2xl font-display font-black text-white">{fmtIDR(p.price)}</span>
                    <span className="text-[#8BA8C2] text-xs">{p.period}</span>
                  </p>
                  <ul className="space-y-2 flex-1 mb-5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-[#8BA8C2] text-xs">
                        <Check size={13} className="text-[#00E676] mt-0.5 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => createOrder(p.id)}
                    disabled={creating}
                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-opacity disabled:opacity-50 ${
                      p.popular
                        ? 'bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white hover:opacity-90'
                        : 'bg-white/8 text-white hover:bg-white/15'
                    }`}
                  >
                    {creating && selectedPlan === p.id ? 'Membuat order...' : 'Pilih Plan Ini'}
                  </button>
                </div>
              ))}
            </div>

            {/* History */}
            <h2 className="text-white font-display font-bold text-lg mb-4">Riwayat Pembayaran</h2>
            <div className="rounded-2xl glass border border-white/8 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b border-white/5">
                    {['Order ID', 'Plan', 'Jumlah', 'Status', 'Catatan Admin', 'Tanggal'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {history.map((h) => {
                      const st = STATUS_INFO[h.status] ?? STATUS_INFO.pending;
                      return (
                        <tr key={h.order_id} className="border-b border-white/3">
                          <td className="px-4 py-3 font-mono text-xs text-[#8BA8C2]">{h.order_id}</td>
                          <td className="px-4 py-3 text-white text-sm uppercase font-mono">{h.plan}</td>
                          <td className="px-4 py-3 font-mono text-sm text-white whitespace-nowrap">{fmtIDR(h.amount)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${st.cls}`}>
                              {st.icon} {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#8BA8C2] text-xs max-w-[200px] truncate">{h.catatan_admin ?? '—'}</td>
                          <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono whitespace-nowrap">
                            {new Date(h.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })}
                    {history.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-[#4A6080] text-xs">Belum ada transaksi.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {step === 'pay' && order && plan && (
          <div className="max-w-2xl">
            {/* Order summary */}
            <div className="rounded-2xl glass border border-[#00D4FF]/30 p-5 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-[#4A6080] text-[10px] font-mono uppercase tracking-wider">Order ID</p>
                  <p className="text-white font-mono text-sm">{order.order_id}</p>
                </div>
                <div>
                  <p className="text-[#4A6080] text-[10px] font-mono uppercase tracking-wider">Plan</p>
                  <p className="text-white font-semibold text-sm">{plan.name}</p>
                </div>
                <div>
                  <p className="text-[#4A6080] text-[10px] font-mono uppercase tracking-wider">Total Transfer</p>
                  <p className="text-[#00E676] font-display font-black text-xl">{fmtIDR(order.amount)}</p>
                </div>
              </div>
              <p className="text-[#FFD700] text-xs mt-3 flex items-center gap-1.5">
                <Clock size={12} /> Order berlaku 24 jam. Selesaikan pembayaran sebelum kadaluarsa.
              </p>
            </div>

            {/* Bank accounts */}
            <div className="rounded-2xl glass border border-white/8 p-5 mb-6">
              <h3 className="text-white font-semibold text-sm mb-4">1 — Transfer ke salah satu rekening:</h3>
              <div className="space-y-3">
                {BANK_ACCOUNTS.map((b) => (
                  <div key={b.bank} className="flex items-center justify-between rounded-xl bg-white/3 border border-white/5 px-4 py-3">
                    <div>
                      <p className="text-[#00D4FF] text-xs font-bold">{b.bank}</p>
                      <p className="text-white font-mono text-sm mt-0.5">{b.number}</p>
                      <p className="text-[#4A6080] text-xs">a.n. {b.name}</p>
                    </div>
                    <button onClick={() => copyText(b.number.replace(/[^0-9]/g, ''), b.bank)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[#8BA8C2] text-xs hover:text-white transition-colors">
                      <Copy size={12} /> {copied === b.bank ? 'Tersalin!' : 'Salin'}
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-[#00E676]/5 border border-[#00E676]/20 px-4 py-3">
                <div>
                  <p className="text-[#4A6080] text-xs">Nominal persis:</p>
                  <p className="text-[#00E676] font-mono font-bold">{fmtIDR(order.amount)}</p>
                </div>
                <button onClick={() => copyText(String(order.amount), 'amount')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-[#8BA8C2] text-xs hover:text-white transition-colors">
                  <Copy size={12} /> {copied === 'amount' ? 'Tersalin!' : 'Salin'}
                </button>
              </div>
            </div>

            {/* Upload bukti */}
            <div className="rounded-2xl glass border border-white/8 p-5 space-y-4">
              <h3 className="text-white font-semibold text-sm">2 — Upload bukti transfer:</h3>
              <div>
                <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Metode Bayar</label>
                <select value={metode} onChange={(e) => setMetode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A1128] border border-white/10 text-white text-sm focus:outline-none">
                  <option>Transfer Bank</option>
                  <option>DANA</option>
                  <option>OVO</option>
                  <option>GoPay</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Screenshot Bukti (JPG/PNG, max 5MB)</label>
                <label className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white/5 border border-dashed border-white/15 cursor-pointer hover:border-[#00D4FF]/50 transition-colors">
                  <FileImage size={18} className="text-[#00D4FF]" />
                  <span className="text-sm text-[#8BA8C2] truncate">
                    {file ? file.name : 'Klik untuk pilih file...'}
                  </span>
                  <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Catatan (opsional)</label>
                <input value={catatan} onChange={(e) => setCatatan(e.target.value)}
                  placeholder="Contoh: transfer dari rekening a.n. Budi"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={submitBukti} disabled={uploading || !file}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-2">
                  {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                  {uploading ? 'Mengupload...' : 'Kirim Bukti Pembayaran'}
                </button>
                <button onClick={() => { setStep('choose'); setOrder(null); }}
                  className="px-5 py-3 rounded-xl bg-white/5 text-[#8BA8C2] text-sm hover:text-white transition-colors">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function UpgradePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<div className="min-h-screen bg-[#060B18]" />}>
        <UpgradeContent />
      </Suspense>
    </AuthGuard>
  );
}
