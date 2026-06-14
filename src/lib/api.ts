// =============================================
// API Client — matches TradeSignal Pro backend
// Backend: Express @ port 3000
// All endpoints require Bearer JWT except health
// =============================================
import axios from 'axios';
import type { ApiResponse, Signal, MarketData, PortfolioPosition, User, TrackRecordStats, SignalResult } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tsp_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → clear token (don't redirect, let UI handle)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('tsp_token');
    }
    return Promise.reject(err);
  }
);

// =============================================
// SWR Fetchers — match exact backend responses
// GET /api/market/:category → { success, data: MarketData[] }
// GET /api/signals          → { success, count, plan, data: Signal[] }
// GET /api/portfolio        → { success, data: PortfolioPosition[] }
// GET /api/auth/me          → { success, user: User }
// =============================================

// Normalize numeric fields that Postgres returns as strings
function normalizeMarket(rows: MarketData[]): MarketData[] {
  return (rows ?? []).map((r) => ({
    ...r,
    price: r.price != null ? Number(r.price) : null,
    change_pct: r.change_pct != null ? Number(r.change_pct) : null,
  }));
}

function normalizeSignals(rows: Signal[]): Signal[] {
  return (rows ?? []).map((r) => ({
    ...r,
    price_entry: r.price_entry != null ? Number(r.price_entry) : null,
    price_target: r.price_target != null ? Number(r.price_target) : null,
    price_stop_loss: r.price_stop_loss != null ? Number(r.price_stop_loss) : null,
    confidence: r.confidence != null ? Number(r.confidence) : null,
    score: r.score != null ? Number(r.score) : 0,
    rsi: r.rsi != null ? Number(r.rsi) : null,
    adx: r.adx != null ? Number(r.adx) : null,
  }));
}

export const fetchers = {
  marketIDN: async (): Promise<MarketData[]> => {
    const res = await api.get<ApiResponse<MarketData[]>>('/api/market/idn');
    return normalizeMarket(res.data.data ?? []);
  },
  marketAsing: async (): Promise<MarketData[]> => {
    const res = await api.get<ApiResponse<MarketData[]>>('/api/market/asing');
    return normalizeMarket(res.data.data ?? []);
  },
  marketCrypto: async (): Promise<MarketData[]> => {
    const res = await api.get<ApiResponse<MarketData[]>>('/api/market/crypto');
    return normalizeMarket(res.data.data ?? []);
  },
  signals: async (): Promise<Signal[]> => {
    const res = await api.get<ApiResponse<Signal[]>>('/api/signals');
    return normalizeSignals(res.data.data ?? []);
  },
  portfolio: async (): Promise<PortfolioPosition[]> => {
    const res = await api.get<{ success: boolean; data?: { positions?: PortfolioPosition[] } }>('/api/portfolio');
    return res.data.data?.positions ?? [];
  },
  me: async (): Promise<User | null> => {
    const res = await api.get<{ success: boolean; user: User }>('/api/auth/me');
    return res.data.user ?? null;
  },
  trackRecordStats: async (): Promise<TrackRecordStats | null> => {
    const res = await api.get<{ success: boolean; data: TrackRecordStats }>('/api/signals/track-record/stats');
    return res.data.data ?? null;
  },
  trackRecordRecent: async (): Promise<SignalResult[]> => {
    const res = await api.get<{ success: boolean; data: SignalResult[] }>('/api/signals/track-record/recent?limit=15');
    return res.data.data ?? [];
  },
};

// =============================================
// Auth API
// POST /api/auth/register → { success, token, user }
// POST /api/auth/login    → { success, token, user }
// =============================================
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ success: boolean; token: string; user: User; message: string }>(
      '/api/auth/login', { email, password }
    ),
  register: (data: { name: string; email: string; password: string }) =>
    api.post<{ success: boolean; token: string; user: User; message: string }>(
      '/api/auth/register', data
    ),
  forgotPassword: (email: string) =>
    api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/api/auth/reset-password', { token, password }),
};

// =============================================
// Payment API — manual transfer flow
// =============================================
export interface PaymentOrder {
  order_id: string; plan: string; amount: number; expired_at: string;
}
export interface PaymentHistory {
  order_id: string; plan: string; amount: number; status: string;
  metode_bayar?: string; bukti_url?: string; catatan_admin?: string;
  paid_at?: string; created_at: string; expired_at?: string;
}
export const paymentAPI = {
  createOrder: async (plan: string): Promise<PaymentOrder> => {
    const res = await api.post<{ success: boolean; order: PaymentOrder }>('/api/payment/create-order', { plan });
    return res.data.order;
  },
  uploadBukti: (orderId: string, file: File, metode: string, catatan?: string) => {
    const fd = new FormData();
    fd.append('bukti', file);
    fd.append('order_id', orderId);
    fd.append('metode_bayar', metode);
    if (catatan) fd.append('catatan', catatan);
    return api.post<{ success: boolean; message: string }>('/api/payment/upload-bukti', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  history: async (): Promise<PaymentHistory[]> => {
    const res = await api.get<{ success: boolean; data: PaymentHistory[] }>('/api/payment/history');
    return res.data.data ?? [];
  },
};

// =============================================
// Watchlist API
// =============================================
export interface WatchlistItem {
  id: number; symbol: string; category: string;
  alert_price?: number | null; alert_type?: string; created_at: string;
}
export const watchlistAPI = {
  list: async (): Promise<WatchlistItem[]> => {
    const res = await api.get<{ success: boolean; data: WatchlistItem[] }>('/api/portfolio/watchlist');
    return res.data.data ?? [];
  },
  add: (symbol: string, category: string) =>
    api.post('/api/portfolio/watchlist', { symbol, category }),
  remove: (symbol: string) =>
    api.delete(`/api/portfolio/watchlist/${encodeURIComponent(symbol)}`),
};

// =============================================
// Notifications API
// =============================================
export interface Notification {
  id: number; title: string; body: string; type: string;
  is_read: boolean; created_at: string;
}
export const notificationsAPI = {
  list: async (): Promise<Notification[]> => {
    const res = await api.get<{ success: boolean; data: Notification[] }>('/api/auth/notifications');
    return res.data.data ?? [];
  },
  markRead: (id: number) => api.put(`/api/auth/notifications/${id}/read`),
  readAll: () => api.put('/api/auth/notifications/read-all'),
};

export default api;
