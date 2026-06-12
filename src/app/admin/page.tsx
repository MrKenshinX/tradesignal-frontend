'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  adminAuth, adminAPI,
  type AdminOverview, type ManagedUser, type AdminSubscription,
  type AdminRevenue, type AdminTransaction, type BroadcastLog,
} from '@/lib/admin-api';
import {
  Shield, Users, CreditCard, TrendingUp, Radio, LogOut,
  Search, Loader2, ChevronLeft, ChevronRight, RefreshCw, KeyRound,
} from 'lucide-react';

type Tab = 'overview' | 'users' | 'subscriptions' | 'revenue' | 'broadcast' | 'settings';

const fmtIDR = (n: number | string | null | undefined) =>
  'Rp ' + Number(n ?? 0).toLocaleString('id-ID');
const fmtDate = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const PLAN_BADGE: Record<string, string> = {
  free: 'bg-white/10 text-[#8BA8C2]',
  basic: 'bg-[#00D4FF]/15 text-[#00D4FF]',
  pro: 'bg-[#7B2FFF]/15 text-[#B794FF]',
  vip: 'bg-[#FFD700]/15 text-[#FFD700]',
};
const STATUS_BADGE: Record<string, string> = {
  active: 'bg-[#00E676]/15 text-[#00E676]',
  suspended: 'bg-[#FF4757]/15 text-[#FF4757]',
  pending: 'bg-[#FFD700]/15 text-[#FFD700]',
  expired: 'bg-white/10 text-[#8BA8C2]',
  cancelled: 'bg-[#FF4757]/15 text-[#FF4757]',
  success: 'bg-[#00E676]/15 text-[#00E676]',
  failed: 'bg-[#FF4757]/15 text-[#FF4757]',
};

function Badge({ value, map }: { value: string; map: Record<string, string> }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${map[value] ?? 'bg-white/10 text-[#8BA8C2]'}`}>
      {value}
    </span>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl glass border border-white/8 p-5">
      <p className="text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-display font-black mt-2 ${accent ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-[#8BA8C2] mt-1">{sub}</p>}
    </div>
  );
}

// ============ OVERVIEW TAB ============
function OverviewTab() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [analytics, setAnalytics] = useState<{ dau: number; newToday: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ov, an] = await Promise.all([adminAPI.overview(), adminAPI.analytics().catch(() => null)]);
      setData(ov); setAnalytics(an);
    } catch { /* handled by interceptor */ }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00D4FF]" size={28} /></div>;
  if (!data) return <p className="text-[#8BA8C2] text-sm text-center py-20">Gagal memuat data.</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(data.totalUsers ?? 0)} sub={`+${data.newUsers ?? 0} bulan ini`} />
        <StatCard label="Sinyal Aktif" value={String(data.activeSignals ?? 0)} accent="text-[#00D4FF]" />
        <StatCard label="Revenue Bulan Ini" value={fmtIDR(data.revenue?.thisMonth)} accent="text-[#00E676]" />
        <StatCard label="Revenue YTD" value={fmtIDR(data.revenue?.ytd)} accent="text-[#00E676]" />
      </div>

      {analytics && (
        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Daily Active Users" value={String(analytics.dau ?? 0)} accent="text-[#7B2FFF]" />
          <StatCard label="User Baru Hari Ini" value={String(analytics.newToday ?? 0)} accent="text-[#00D4FF]" />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Plan distribution */}
        <div className="rounded-2xl glass border border-white/8 p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Distribusi Plan</h3>
          <div className="space-y-3">
            {(data.planDistribution ?? []).map((p) => {
              const total = (data.planDistribution ?? []).reduce((s, x) => s + Number(x.count), 0) || 1;
              const pct = (Number(p.count) / total) * 100;
              return (
                <div key={p.plan}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#8BA8C2] uppercase font-mono">{p.plan}</span>
                    <span className="text-white font-mono">{p.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent users */}
        <div className="rounded-2xl glass border border-white/8 p-5">
          <h3 className="text-white font-semibold text-sm mb-4">User Terbaru</h3>
          <div className="space-y-2.5">
            {(data.recentUsers ?? []).slice(0, 6).map((u) => (
              <div key={u.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{u.name}</p>
                  <p className="text-[#4A6080] text-xs truncate">{u.email}</p>
                </div>
                <Badge value={u.plan} map={PLAN_BADGE} />
              </div>
            ))}
            {(!data.recentUsers || data.recentUsers.length === 0) && (
              <p className="text-[#4A6080] text-xs">Belum ada user.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-2xl glass border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h3 className="text-white font-semibold text-sm">Transaksi Terbaru</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['User', 'Plan', 'Jumlah', 'Status', 'Tanggal'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {(data.recentTransactions ?? []).map((t) => (
                <tr key={t.id} className="border-b border-white/3">
                  <td className="px-5 py-3"><p className="text-white text-sm">{t.name ?? '—'}</p><p className="text-[#4A6080] text-xs">{t.email ?? ''}</p></td>
                  <td className="px-5 py-3"><Badge value={t.plan} map={PLAN_BADGE} /></td>
                  <td className="px-5 py-3 font-mono text-sm text-white">{fmtIDR(t.amount)}</td>
                  <td className="px-5 py-3"><Badge value={t.status} map={STATUS_BADGE} /></td>
                  <td className="px-5 py-3 text-[#8BA8C2] text-xs font-mono">{fmtDate(t.created_at)}</td>
                </tr>
              ))}
              {(!data.recentTransactions || data.recentTransactions.length === 0) && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-[#4A6080] text-xs">Belum ada transaksi.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ USERS TAB ============
function UsersTab() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.users({ search: search || undefined, plan: planFilter || undefined, page, limit: 15 });
      setUsers(res.data ?? []);
      setPages(res.pagination?.pages ?? 1);
      setTotal(res.pagination?.total ?? 0);
    } catch { /* */ }
    setLoading(false);
  }, [search, planFilter, page]);
  useEffect(() => { load(); }, [load]);

  const changePlan = async (id: number, plan: string) => {
    setBusy(id);
    try {
      await adminAPI.updateUser(id, { plan });
      setMsg(`Plan user #${id} → ${plan.toUpperCase()}`);
      await load();
    } catch { setMsg('Gagal update plan.'); }
    setBusy(null);
    setTimeout(() => setMsg(''), 3000);
  };

  const toggleStatus = async (u: ManagedUser) => {
    setBusy(u.id);
    try {
      if (u.status === 'active') await adminAPI.suspendUser(u.id);
      else await adminAPI.updateUser(u.id, { status: 'active' });
      setMsg(u.status === 'active' ? `User ${u.name} disuspend.` : `User ${u.name} diaktifkan.`);
      await load();
    } catch { setMsg('Gagal mengubah status.'); }
    setBusy(null);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4A6080]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama atau email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none"
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-[#0A1128] border border-white/10 text-white text-sm focus:outline-none"
        >
          <option value="">Semua Plan</option>
          <option value="free">Free</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
          <option value="vip">VIP</option>
        </select>
        <button onClick={load} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white transition-colors">
          <RefreshCw size={15} />
        </button>
      </div>

      {msg && <div className="px-4 py-2.5 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-sm">{msg}</div>}

      <div className="rounded-2xl glass border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['User', 'Plan', 'Status', 'Daftar', 'Ubah Plan', 'Aksi'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center"><Loader2 className="animate-spin text-[#00D4FF] inline" size={22} /></td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="border-b border-white/3 hover:bg-white/3">
                  <td className="px-4 py-3 min-w-[180px]">
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-[#4A6080] text-xs">{u.email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge value={u.plan} map={PLAN_BADGE} /></td>
                  <td className="px-4 py-3"><Badge value={u.status} map={STATUS_BADGE} /></td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono whitespace-nowrap">{fmtDate(u.created_at)}</td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={u.plan} disabled={busy === u.id}
                      onChange={(e) => changePlan(u.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0A1128] border border-white/10 text-white text-xs focus:outline-none"
                    >
                      <option value="free">Free</option>
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                      <option value="vip">VIP</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleStatus(u)} disabled={busy === u.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                        u.status === 'active'
                          ? 'bg-[#FF4757]/10 text-[#FF4757] hover:bg-[#FF4757]/20'
                          : 'bg-[#00E676]/10 text-[#00E676] hover:bg-[#00E676]/20'
                      }`}
                    >
                      {busy === u.id ? '...' : u.status === 'active' ? 'Suspend' : 'Aktifkan'}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-[#4A6080] text-xs">Tidak ada user ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
          <p className="text-[#4A6080] text-xs font-mono">{total} user total</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
              className="p-1.5 rounded-lg bg-white/5 text-[#8BA8C2] disabled:opacity-30"><ChevronLeft size={14} /></button>
            <span className="text-xs font-mono text-[#8BA8C2]">{page} / {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}
              className="p-1.5 rounded-lg bg-white/5 text-[#8BA8C2] disabled:opacity-30"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUBSCRIPTIONS TAB ============
function SubscriptionsTab() {
  const [subs, setSubs] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try { setSubs(await adminAPI.subscriptions()); } catch { /* */ }
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const extend = async (id: number, months: number) => {
    setBusy(id);
    try {
      const res = await adminAPI.extendSubscription(id, months);
      setMsg((res.data as { message?: string }).message ?? 'Diperpanjang.');
      await load();
    } catch { setMsg('Gagal memperpanjang.'); }
    setBusy(null);
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="space-y-4">
      {msg && <div className="px-4 py-2.5 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-sm">{msg}</div>}
      <div className="rounded-2xl glass border border-white/8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['User', 'Plan', 'Status', 'Harga', 'Mulai', 'Berakhir', 'Perpanjang'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center"><Loader2 className="animate-spin text-[#00D4FF] inline" size={22} /></td></tr>
              ) : subs.map((s) => (
                <tr key={s.id} className="border-b border-white/3 hover:bg-white/3">
                  <td className="px-4 py-3 min-w-[160px]">
                    <p className="text-white text-sm font-medium">{s.name}</p>
                    <p className="text-[#4A6080] text-xs">{s.email}</p>
                  </td>
                  <td className="px-4 py-3"><Badge value={s.plan} map={PLAN_BADGE} /></td>
                  <td className="px-4 py-3"><Badge value={s.status} map={STATUS_BADGE} /></td>
                  <td className="px-4 py-3 font-mono text-sm text-white whitespace-nowrap">{fmtIDR(s.price)}</td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono whitespace-nowrap">{fmtDate(s.started_at)}</td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono whitespace-nowrap">{fmtDate(s.expires_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {[1, 3, 12].map(m => (
                        <button key={m} onClick={() => extend(s.id, m)} disabled={busy === s.id}
                          className="px-2.5 py-1 rounded-lg bg-[#00D4FF]/10 text-[#00D4FF] text-xs font-semibold hover:bg-[#00D4FF]/20 disabled:opacity-50">
                          +{m}bln
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && subs.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-[#4A6080] text-xs">Belum ada langganan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ REVENUE TAB ============
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function RevenueTab() {
  const [data, setData] = useState<AdminRevenue | null>(null);
  const [tx, setTx] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [rev, trans] = await Promise.all([
          adminAPI.revenue(),
          adminAPI.transactions({ limit: 20 }).catch(() => []),
        ]);
        setData(rev); setTx(trans);
      } catch { /* */ }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#00D4FF]" size={28} /></div>;
  if (!data) return <p className="text-[#8BA8C2] text-sm text-center py-20">Gagal memuat data revenue.</p>;

  const maxMonthly = Math.max(...(data.monthly ?? []).map(m => Number(m.total)), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="MRR (Monthly Recurring)" value={fmtIDR(data.mrr)} accent="text-[#00E676]" />
        <StatCard label="Churn Bulan Ini" value={String(data.churn ?? 0)} accent="text-[#FF4757]" />
      </div>

      {/* Monthly bar chart */}
      <div className="rounded-2xl glass border border-white/8 p-5">
        <h3 className="text-white font-semibold text-sm mb-5">Revenue Bulanan ({new Date().getFullYear()})</h3>
        <div className="flex items-end gap-2 h-40">
          {Array.from({ length: 12 }).map((_, i) => {
            const m = (data.monthly ?? []).find(x => Number(x.month) === i + 1);
            const val = Number(m?.total ?? 0);
            const h = (val / maxMonthly) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full bg-white/5 rounded-t flex items-end" style={{ height: '128px' }}>
                  <div className="w-full bg-gradient-to-t from-[#00D4FF] to-[#7B2FFF] rounded-t transition-all"
                    style={{ height: `${h}%` }} title={fmtIDR(val)} />
                </div>
                <span className="text-[9px] font-mono text-[#4A6080]">{MONTH_NAMES[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By plan */}
      <div className="rounded-2xl glass border border-white/8 p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Revenue per Plan</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {(data.byPlan ?? []).map((p) => (
            <div key={p.plan} className="rounded-xl bg-white/3 border border-white/5 p-4">
              <Badge value={p.plan} map={PLAN_BADGE} />
              <p className="text-white font-display font-bold text-lg mt-2">{fmtIDR(p.total)}</p>
              <p className="text-[#4A6080] text-xs mt-0.5">{p.count} transaksi</p>
            </div>
          ))}
          {(!data.byPlan || data.byPlan.length === 0) && <p className="text-[#4A6080] text-xs">Belum ada data.</p>}
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl glass border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h3 className="text-white font-semibold text-sm">20 Transaksi Terakhir</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['User', 'Plan', 'Jumlah', 'Status', 'Tanggal'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {tx.map((t) => (
                <tr key={t.id} className="border-b border-white/3">
                  <td className="px-4 py-3"><p className="text-white text-sm">{t.name}</p><p className="text-[#4A6080] text-xs">{t.email}</p></td>
                  <td className="px-4 py-3"><Badge value={t.plan} map={PLAN_BADGE} /></td>
                  <td className="px-4 py-3 font-mono text-sm text-white">{fmtIDR(t.amount)}</td>
                  <td className="px-4 py-3"><Badge value={t.status} map={STATUS_BADGE} /></td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono">{fmtDate(t.created_at)}</td>
                </tr>
              ))}
              {tx.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[#4A6080] text-xs">Belum ada transaksi.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ BROADCAST TAB ============
function BroadcastTab() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState('all');
  const [channel, setChannel] = useState('in-app');
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const [logs, setLogs] = useState<BroadcastLog[]>([]);

  const loadLogs = useCallback(async () => {
    try { setLogs(await adminAPI.broadcastLogs()); } catch { /* */ }
  }, []);
  useEffect(() => { loadLogs(); }, [loadLogs]);

  const send = async () => {
    if (!title || !body) { setMsg('Judul dan isi pesan wajib diisi.'); return; }
    setSending(true);
    try {
      const res = await adminAPI.broadcast({ title, body, target, channel });
      setMsg(res.data.message ?? 'Broadcast terkirim.');
      setTitle(''); setBody('');
      await loadLogs();
    } catch { setMsg('Gagal mengirim broadcast.'); }
    setSending(false);
    setTimeout(() => setMsg(''), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl glass border border-white/8 p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm">Kirim Broadcast</h3>
        {msg && <div className="px-4 py-2.5 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF] text-sm">{msg}</div>}
        <div>
          <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Judul</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Update Fitur Baru!"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none" />
        </div>
        <div>
          <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Isi Pesan</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
            placeholder="Tulis pesan untuk pengguna..."
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none resize-none" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Target</label>
            <select value={target} onChange={(e) => setTarget(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A1128] border border-white/10 text-white text-sm focus:outline-none">
              <option value="all">Semua User</option>
              <option value="free">Plan Free</option>
              <option value="basic">Plan Basic</option>
              <option value="pro">Plan Pro</option>
              <option value="vip">Plan VIP</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-[#8BA8C2] uppercase tracking-wider mb-2">Channel</label>
            <select value={channel} onChange={(e) => setChannel(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A1128] border border-white/10 text-white text-sm focus:outline-none">
              <option value="in-app">Notifikasi In-App</option>
              <option value="in-app,email">In-App + Email (max 50)</option>
            </select>
          </div>
        </div>
        <button onClick={send} disabled={sending}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {sending && <Loader2 size={14} className="animate-spin" />}
          {sending ? 'Mengirim...' : 'Kirim Broadcast'}
        </button>
      </div>

      {/* Logs */}
      <div className="rounded-2xl glass border border-white/8 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5"><h3 className="text-white font-semibold text-sm">Riwayat Broadcast</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-white/5">
              {['Judul', 'Target', 'Channel', 'Terkirim', 'Tanggal'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-[10px] font-mono text-[#4A6080] uppercase tracking-wider">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-b border-white/3">
                  <td className="px-4 py-3"><p className="text-white text-sm font-medium">{l.title}</p><p className="text-[#4A6080] text-xs truncate max-w-[260px]">{l.body}</p></td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono uppercase">{l.target}</td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono">{l.channel}</td>
                  <td className="px-4 py-3 text-white text-sm font-mono">{l.sent_count}</td>
                  <td className="px-4 py-3 text-[#8BA8C2] text-xs font-mono">{fmtDate(l.created_at)}</td>
                </tr>
              ))}
              {logs.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-[#4A6080] text-xs">Belum ada broadcast.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS TAB ============
function SettingsTab() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const submit = async () => {
    if (!current || !newPass) { setMsg({ type: 'err', text: 'Semua field wajib diisi.' }); return; }
    if (newPass !== confirm) { setMsg({ type: 'err', text: 'Konfirmasi password tidak cocok.' }); return; }
    if (newPass.length < 8) { setMsg({ type: 'err', text: 'Password baru minimal 8 karakter.' }); return; }
    setBusy(true);
    try {
      await adminAPI.changePassword({ current_password: current, new_password: newPass });
      setMsg({ type: 'ok', text: 'Password admin berhasil diubah.' });
      setCurrent(''); setNewPass(''); setConfirm('');
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setMsg({ type: 'err', text: ax.response?.data?.message ?? 'Gagal mengubah password.' });
    }
    setBusy(false);
  };

  return (
    <div className="max-w-md">
      <div className="rounded-2xl glass border border-white/8 p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2"><KeyRound size={15} /> Ganti Password Admin</h3>
        {msg && (
          <div className={`px-4 py-2.5 rounded-xl text-sm ${
            msg.type === 'ok' ? 'bg-[#00E676]/10 border border-[#00E676]/30 text-[#00E676]'
              : 'bg-[#FF4757]/10 border border-[#FF4757]/30 text-[#FF4757]'}`}>
            {msg.text}
          </div>
        )}
        <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)}
          placeholder="Password saat ini"
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none" />
        <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
          placeholder="Password baru (min. 8 karakter)"
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none" />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
          placeholder="Konfirmasi password baru"
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:border-[#00D4FF] focus:outline-none" />
        <button onClick={submit} disabled={busy}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF4757] to-[#7B2FFF] text-white font-bold text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />}
          {busy ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </div>
    </div>
  );
}

// ============ MAIN ADMIN PAGE ============
const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <TrendingUp size={15} /> },
  { id: 'users', label: 'Users', icon: <Users size={15} /> },
  { id: 'subscriptions', label: 'Langganan', icon: <CreditCard size={15} /> },
  { id: 'revenue', label: 'Revenue', icon: <TrendingUp size={15} /> },
  { id: 'broadcast', label: 'Broadcast', icon: <Radio size={15} /> },
  { id: 'settings', label: 'Settings', icon: <KeyRound size={15} /> },
];

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [ready, setReady] = useState(false);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    if (!adminAuth.hasToken()) {
      router.replace('/admin/login');
      return;
    }
    const stored = adminAuth.getStored();
    if (stored?.name) setAdminName(stored.name);
    setReady(true);
  }, [router]);

  const logout = () => {
    adminAuth.logout();
    router.replace('/admin/login');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#00D4FF]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060B18]">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0A1128]/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF4757] to-[#7B2FFF] flex items-center justify-center">
              <Shield size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-display font-bold text-sm leading-tight">Admin Panel</h1>
              <p className="text-[#4A6080] text-[11px]">TradeSignal Pro</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#8BA8C2] text-xs hidden sm:block">👤 {adminName}</span>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF4757]/10 text-[#FF4757] text-xs font-semibold hover:bg-[#FF4757]/20 transition-colors">
              <LogOut size={13} /> Keluar
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto pb-px -mb-px">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id
                    ? 'border-[#00D4FF] text-[#00D4FF]'
                    : 'border-transparent text-[#8BA8C2] hover:text-white'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'subscriptions' && <SubscriptionsTab />}
        {tab === 'revenue' && <RevenueTab />}
        {tab === 'broadcast' && <BroadcastTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
