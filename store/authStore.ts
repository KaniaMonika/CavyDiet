import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  setAuth: (user: User, token: string) => void;
  updateUsername: (username: string) => void;
  logout: () => void;
}



export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      setAuth: (user, token) =>
        set({
          user,
          token,
        }),
      updateUsername: (username) =>
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              username,
            }
          : null,
      })),  

      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);