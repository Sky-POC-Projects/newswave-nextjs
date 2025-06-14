import type { UserRole } from '@/types';

const ROLE_KEY = 'newsWaveUserRole';
const USER_ID_KEY = 'newsWaveUserId';

export const saveAuthSession = (role: UserRole, userId?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, role);
    if (userId && role === 'publisher') {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  }
};

export const getAuthSession = (): { role: UserRole | null; userId: string | null } => {
  if (typeof window === 'undefined') {
    return { role: null, userId: null };
  }
  const role = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const userId = role === 'publisher' ? localStorage.getItem(USER_ID_KEY) : null;
  return { role, userId };
};

export const clearAuthSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }
};
