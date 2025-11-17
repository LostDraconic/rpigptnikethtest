import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'student' | 'professor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isProfessor: () => boolean;
  isStudent: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      isProfessor: () => get().user?.role === 'professor',
      isStudent: () => get().user?.role === 'student',
    }),
    {
      name: 'rpi-gpt-auth',
    }
  )
);
