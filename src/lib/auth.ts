import type { UserRole } from '@/types';

const ROLE_KEY = 'newsWaveUserRole';
const USER_ID_KEY = 'newsWaveUserId'; // Will store numeric ID as string
const USER_NAME_KEY = 'newsWaveUserName'; // Store user name for display

export const saveAuthSession = (role: UserRole, userId: string, userName?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, role);
    localStorage.setItem(USER_ID_KEY, userId);
    if (userName) {
      localStorage.setItem(USER_NAME_KEY, userName);
    } else {
      localStorage.removeItem(USER_NAME_KEY);
    }
  }
};

export const getAuthSession = (): { role: UserRole | null; userId: string | null; userName: string | null } => {
  if (typeof window === 'undefined') {
    return { role: null, userId: null, userName: null };
  }
  const role = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const userId = localStorage.getItem(USER_ID_KEY);
  const userName = localStorage.getItem(USER_NAME_KEY);
  return { role, userId, userName };
};

export const clearAuthSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(USER_NAME_KEY);
  }
};
