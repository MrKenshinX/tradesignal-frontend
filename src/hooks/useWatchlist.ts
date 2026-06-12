'use client';
import useSWR from 'swr';
import { watchlistAPI, type WatchlistItem } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export function useWatchlist() {
  const { user } = useAuthStore();
  const { data, mutate, isLoading } = useSWR<WatchlistItem[]>(
    user ? 'watchlist' : null,
    () => watchlistAPI.list(),
    { revalidateOnFocus: false }
  );

  const symbols = new Set((data ?? []).map(w => w.symbol));

  const toggle = async (symbol: string, category: string) => {
    const sym = symbol.toUpperCase();
    if (symbols.has(sym)) {
      await watchlistAPI.remove(sym).catch(() => {});
    } else {
      await watchlistAPI.add(sym, category).catch(() => {});
    }
    mutate();
  };

  return { items: data ?? [], symbols, toggle, isLoading, refresh: mutate };
}
