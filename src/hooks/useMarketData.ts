import useSWR from 'swr';
import { fetchers } from '@/lib/api';
import type { MarketData, Signal, PortfolioPosition, User } from '@/types';

const SWR_OPTS = { revalidateOnFocus: false, shouldRetryOnError: true, errorRetryCount: 3 };

export function useMarketIDN() {
  return useSWR<MarketData[]>('market/idn', fetchers.marketIDN, {
    ...SWR_OPTS, refreshInterval: 60000,  // IDN: 1 menit
  });
}

export function useMarketAsing() {
  return useSWR<MarketData[]>('market/asing', fetchers.marketAsing, {
    ...SWR_OPTS, refreshInterval: 60000,
  });
}

export function useMarketCrypto() {
  return useSWR<MarketData[]>('market/crypto', fetchers.marketCrypto, {
    ...SWR_OPTS, refreshInterval: 15000,  // Crypto: 15 detik (Binance WS fallback)
  });
}

export function useSignals() {
  return useSWR<Signal[]>('signals', fetchers.signals, {
    ...SWR_OPTS, refreshInterval: 300000, // 5 menit — cocok dengan cron backend
  });
}

export function usePortfolio() {
  return useSWR<PortfolioPosition[]>('portfolio', fetchers.portfolio, {
    ...SWR_OPTS, refreshInterval: 60000,
  });
}

export function useCurrentUser() {
  return useSWR<User | null>('auth/me', fetchers.me, {
    ...SWR_OPTS, refreshInterval: 0, // no auto-refresh for user session
  });
}
