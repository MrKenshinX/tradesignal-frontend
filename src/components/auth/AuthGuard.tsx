'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Zap } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login?redirect=' + window.location.pathname);
    } else {
      setChecking(false);
    }
  }, [token, router]);

  if (checking && !token) {
    return (
      <div className="min-h-screen bg-[#060B18] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#7B2FFF] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap size={22} className="text-white" fill="white" />
          </div>
          <p className="text-[#4A6080] text-sm">Memeriksa sesi...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
