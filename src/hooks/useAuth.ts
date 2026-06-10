'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { fetchers } from '@/lib/api';

export function useRequireAuth() {
  const router = useRouter();
  const { token, user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    // Fetch user data if token exists but no user
    if (token && !user) {
      setLoading(true);
      fetchers.me()
        .then(u => { if (u) setUser(u); })
        .catch(() => router.push('/auth/login'))
        .finally(() => setLoading(false));
    }
  }, [token, user, router, setUser, setLoading]);

  return { user, token, isAuthenticated: !!token };
}
