// src/hooks/useAuth.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserRole } from '@/types';
import { saveAuthSession as saveSession, getAuthSession as getSession, clearAuthSession as clearSession } from '@/lib/auth';
import { createPublisher, createSubscriber } from '@/services/apiService';

interface AuthState {
  role: UserRole | null;
  userId: number | null; // Numeric ID from API
  userName: string | null; // User's name
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ role: null, userId: null, userName: null, isLoading: true });
  const router = useRouter();

  useEffect(() => {
    const { role, userId: userIdStr, userName } = getSession();
    setAuthState({ 
      role, 
      userId: userIdStr ? parseInt(userIdStr, 10) : null, 
      userName, 
      isLoading: false 
    });
  }, []);

  const login = useCallback(async (role: UserRole, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      let apiResponse: { id: number; name: string | null };
      if (role === 'publisher') {
        // For publisher, description is optional in API, mock it for now.
        apiResponse = await createPublisher({ name, description: `${name}'s Publications` });
      } else { // subscriber
        apiResponse = await createSubscriber({ name });
      }

      if (apiResponse && apiResponse.id) {
        const loggedInName = apiResponse.name || name;
        saveSession(role, apiResponse.id.toString(), loggedInName);
        setAuthState({ role, userId: apiResponse.id, userName: loggedInName, isLoading: false });
        
        if (role === 'publisher') {
          router.push('/publisher');
        } else if (role === 'subscriber') {
          router.push('/subscriber');
        }
      } else {
        throw new Error('Failed to get user ID from API');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Here you might want to use a toast to show the error to the user
      setAuthState({ role: null, userId: null, userName: null, isLoading: false });
      // Optionally redirect to login or show error
    }
  }, [router]);

  const logout = useCallback(() => {
    clearSession();
    setAuthState({ role: null, userId: null, userName: null, isLoading: false });
    router.push('/login');
  }, [router]);

  return { ...authState, login, logout };
}
