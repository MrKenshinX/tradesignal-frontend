// =============================================
// API Client — matches TradeSignal Pro backend
// Backend: Express @ port 3000
// All endpoints require Bearer JWT except health
// =============================================
import axios from 'axios';
import type { ApiResponse, Signal, MarketData, PortfolioPosition, User } from '@/types';

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
    const res = await api.get<ApiResponse<PortfolioPosition[]>>('/api/portfolio');
    return res.data.data ?? [];
  },
  me: async (): Promise<User | null> => {
    const res = await api.get<{ success: boolean; user: User }>('/api/auth/me');
    return res.data.user ?? null;
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

export default api;
