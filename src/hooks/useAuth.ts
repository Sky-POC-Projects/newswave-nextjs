'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';
import { saveAuthSession as saveSession, getAuthSession as getSession, clearAuthSession as clearSession } from '@/lib/auth';

interface AuthState {
  role: UserRole | null;
  userId: string | null; // For publisher
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ role: null, userId: null, isLoading: true });
  const router = useRouter();

  useEffect(() => {
    const { role, userId } = getSession();
    setAuthState({ role, userId, isLoading: false });
  }, []);

  const login = useCallback((role: UserRole, userId?: string) => {
    saveSession(role, userId);
    setAuthState({ role, userId, isLoading: false });
    if (role === 'publisher') {
      router.push('/publisher');
    } else if (role === 'subscriber') {
      router.push('/subscriber');
    }
  }, [router]);

  const logout = useCallback(() => {
    clearSession();
    setAuthState({ role: null, userId: null, isLoading: false });
    router.push('/login');
  }, [router]);

  return { ...authState, login, logout };
}
