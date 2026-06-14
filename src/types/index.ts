// =============================================
// Types sesuai exact schema & response backend
// TradeSignal Pro API
// =============================================

// --- Signal (dari table signals + GET /api/signals) ---
export interface Signal {
  id: number;
  symbol: string;
  name: string;
  category: 'idn' | 'asing' | 'crypto';   // lowercase — backend enum
  signal_type: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  price_entry: number | null;
  price_target: number | null;
  price_stop_loss: number | null;
  rsi: number | null;
  macd: string | null;
  bb_position: string | null;
  score: number;
  confidence: number | null;
  adx: number | null;
  atr: number | null;
  volume_ratio: number | null;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  timeframe: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Helpers untuk UI
export function signalLabel(s: Signal['signal_type']): 'BUY' | 'SELL' | 'HOLD' {
  if (s === 'strong_buy' || s === 'buy') return 'BUY';
  if (s === 'strong_sell' || s === 'sell') return 'SELL';
  return 'HOLD';
}

export function marketLabel(c: Signal['category']): 'IDN' | 'ASING' | 'CRYPTO' {
  return c.toUpperCase() as 'IDN' | 'ASING' | 'CRYPTO';
}

// --- Market Cache (dari GET /api/market/:category) ---
export interface MarketData {
  symbol: string;
  price: number | null;
  change_pct: number | null;
  updated_at: string;
  // Field extra dari data JSON column (opsional, tergantung backend)
  name?: string;
  volume?: number;
  market_cap?: number;
  high_24h?: number;
  low_24h?: number;
}

// --- API Response wrappers ---
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  plan?: string;
  message?: string;
}

// --- Portfolio (dari GET /api/portfolio) ---
export interface PortfolioPosition {
  id: number;
  user_id: number;
  symbol: string;
  category: 'idn' | 'asing' | 'crypto';
  buy_price: number;
  quantity: number;
  target_price: number | null;
  stop_loss: number | null;
  notes: string | null;
  status: 'open' | 'closed';
  sell_price: number | null;
  closed_at: string | null;
  created_at: string;
  // computed di frontend
  current_price?: number;
  unrealized_pnl?: number;
  unrealized_pnl_pct?: number;
  total_value?: number;
}

// --- User (dari JWT payload + GET /api/auth/me) ---
export interface User {
  id: number;
  name: string;
  email: string;
  plan: 'free' | 'idn' | 'asing' | 'crypto' | 'vip';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  created_at?: string;
  subscription_expires?: string | null;
}

// UI plan display map
export const PLAN_DISPLAY: Record<User['plan'], string> = {
  free: 'Free',
  idn: 'Premium IDN',
  asing: 'Premium Asing',
  crypto: 'Premium Crypto',
  vip: 'VIP All-Access',
};

export const PLAN_COLOR: Record<User['plan'], string> = {
  free: 'text-[#8BA8C2]',
  idn: 'text-[#00D4FF]',
  asing: 'text-[#7B2FFF]',
  crypto: 'text-[#FFD700]',
  vip: 'text-[#00E676]',
};
