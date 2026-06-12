// =============================================
// Admin API Client — TradeSignal Pro
// Separate token (tsp_admin_token), 8h expiry
// =============================================
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export const adminApi = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('tsp_admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('tsp_admin_token');
      localStorage.removeItem('tsp_admin');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(err);
  }
);

// ---------- Types ----------
export interface AdminUser {
  id: number; name: string; email: string; role: string;
}
export interface AdminOverview {
  totalUsers: number; newUsers: number; activeSignals: number;
  revenue: { thisMonth: number; ytd: number };
  planDistribution: { plan: string; count: number }[];
  recentUsers: { id: number; name: string; email: string; plan: string; created_at: string }[];
  recentTransactions: { id: number; name?: string; email?: string; amount: number; plan: string; status: string; created_at: string }[];
}
export interface ManagedUser {
  id: number; name: string; email: string; plan: string; status: string;
  email_verified: boolean; created_at: string;
}
export interface AdminSubscription {
  id: number; name: string; email: string; plan: string; status: string;
  started_at: string; expires_at: string; auto_renew: boolean; price: number;
}
export interface AdminRevenue {
  monthly: { month: number; total: number }[];
  byPlan: { plan: string; count: number; total: number }[];
  daily: { date: string; total: number }[];
  mrr: number; churn: number;
}
export interface AdminTransaction {
  id: number; name: string; email: string; amount: number; plan: string;
  status: string; payment_method?: string; created_at: string; paid_at?: string;
}
export interface BroadcastLog {
  id: number; title: string; body: string; target: string; channel: string;
  sent_count: number; created_at: string;
}

// ---------- Auth ----------
export const adminAuth = {
  login: (email: string, password: string) =>
    adminApi.post<{ success: boolean; token: string; admin: AdminUser; message?: string }>(
      '/api/auth/admin/login', { email, password }
    ),
  logout: () => {
    localStorage.removeItem('tsp_admin_token');
    localStorage.removeItem('tsp_admin');
  },
  getStored: (): AdminUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('tsp_admin');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  hasToken: (): boolean =>
    typeof window !== 'undefined' && !!localStorage.getItem('tsp_admin_token'),
};

// ---------- Endpoints ----------
export const adminAPI = {
  overview: async (): Promise<AdminOverview> => {
    const res = await adminApi.get<{ success: boolean; data: AdminOverview }>('/api/admin/overview');
    return res.data.data;
  },
  users: async (params: { search?: string; plan?: string; status?: string; page?: number; limit?: number }) => {
    const res = await adminApi.get<{ success: boolean; data: ManagedUser[]; pagination: { total: number; page: number; limit: number; pages: number } }>(
      '/api/admin/users', { params }
    );
    return res.data;
  },
  updateUser: (id: number, body: { plan?: string; status?: string; expires_at?: string }) =>
    adminApi.put(`/api/admin/users/${id}`, body),
  suspendUser: (id: number) => adminApi.delete(`/api/admin/users/${id}`),
  subscriptions: async (): Promise<AdminSubscription[]> => {
    const res = await adminApi.get<{ success: boolean; data: AdminSubscription[] }>('/api/admin/subscriptions');
    return res.data.data ?? [];
  },
  extendSubscription: (id: number, months: number) =>
    adminApi.post(`/api/admin/subscriptions/extend/${id}`, { months }),
  revenue: async (): Promise<AdminRevenue> => {
    const res = await adminApi.get<{ success: boolean; data: AdminRevenue }>('/api/admin/revenue');
    return res.data.data;
  },
  transactions: async (params: { status?: string; page?: number; limit?: number }) => {
    const res = await adminApi.get<{ success: boolean; data: AdminTransaction[] }>('/api/admin/transactions', { params });
    return res.data.data ?? [];
  },
  broadcast: (body: { title: string; body: string; target: string; channel: string }) =>
    adminApi.post<{ success: boolean; message: string; sent_count: number }>('/api/admin/broadcast', body),
  broadcastLogs: async (): Promise<BroadcastLog[]> => {
    const res = await adminApi.get<{ success: boolean; data: BroadcastLog[] }>('/api/admin/broadcast/logs');
    return res.data.data ?? [];
  },
  analytics: async (): Promise<{ dau: number; newToday: number }> => {
    const res = await adminApi.get<{ success: boolean; data: { dau: number; newToday: number } }>('/api/admin/analytics');
    return res.data.data;
  },
  changePassword: (body: { current_password: string; new_password: string }) =>
    adminApi.post('/api/admin/settings/change-password', body),
};
