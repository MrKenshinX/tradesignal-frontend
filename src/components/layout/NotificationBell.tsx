'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';
import { notificationsAPI, type Notification } from '@/lib/api';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'baru saja';
  if (m < 60) return `${m}m lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}j lalu`;
  return `${Math.floor(h / 24)}h lalu`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const unread = items.filter(n => !n.is_read).length;

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await notificationsAPI.list()); } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const iv = setInterval(load, 60000); // refresh tiap 1 menit
    return () => clearInterval(iv);
  }, [load]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const markRead = async (n: Notification) => {
    if (n.is_read) return;
    setItems(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
    try { await notificationsAPI.markRead(n.id); } catch { /* */ }
  };

  const readAll = async () => {
    setItems(prev => prev.map(x => ({ ...x, is_read: true })));
    try { await notificationsAPI.readAll(); } catch { /* */ }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-[#8BA8C2] hover:text-white transition-colors"
        aria-label="Notifikasi"
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#FF4757] text-white text-[9px] font-bold flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-80 rounded-2xl bg-[#0A1128] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-white text-sm font-semibold">Notifikasi</p>
            {unread > 0 && (
              <button onClick={readAll}
                className="flex items-center gap-1 text-[#00D4FF] text-xs hover:underline">
                <CheckCheck size={12} /> Tandai semua dibaca
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="py-10 text-center"><Loader2 size={18} className="animate-spin text-[#00D4FF] inline" /></div>
            ) : items.length === 0 ? (
              <p className="py-10 text-center text-[#4A6080] text-xs">Belum ada notifikasi.</p>
            ) : items.map((n) => (
              <button key={n.id} onClick={() => markRead(n)}
                className={`w-full text-left px-4 py-3 border-b border-white/3 hover:bg-white/3 transition-colors ${
                  !n.is_read ? 'bg-[#00D4FF]/5' : ''}`}>
                <div className="flex items-start gap-2.5">
                  {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] mt-1.5 shrink-0" />}
                  <div className={n.is_read ? 'pl-4' : ''}>
                    <p className="text-white text-xs font-semibold">{n.title}</p>
                    <p className="text-[#8BA8C2] text-xs mt-0.5 line-clamp-2">{n.body}</p>
                    <p className="text-[#4A6080] text-[10px] mt-1 font-mono">{timeAgo(n.created_at)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
