import { jwtDecode } from 'jwt-decode';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { useHerdStore } from '../store/herdStore';

type TokenPayload = {
  exp?: number;
};

export default function SessionGuard() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const resetHerd = useHerdStore(
    (state) => state.resetHerd
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    let expirationTimer:
      | ReturnType<typeof setTimeout>
      | undefined;

    const endSession = () => {
      logout();
      resetHerd();
      router.replace('/');
    };

    const checkAndScheduleExpiration = () => {
      if (expirationTimer) {
        clearTimeout(expirationTimer);
      }

      try {
        const payload =
          jwtDecode<TokenPayload>(token);

        if (!payload.exp) {
          endSession();
          return;
        }

        const remainingTime =
          payload.exp * 1000 - Date.now();

        if (remainingTime <= 0) {
          endSession();
          return;
        }

        expirationTimer = setTimeout(
          endSession,
          remainingTime
        );
      } catch (error) {
        endSession();
      }
    };

    checkAndScheduleExpiration();

    const appStateSubscription =
      AppState.addEventListener(
        'change',
        (nextState) => {
          if (nextState === 'active') {
            checkAndScheduleExpiration();
          }
        }
      );

    return () => {
      if (expirationTimer) {
        clearTimeout(expirationTimer);
      }

      appStateSubscription.remove();
    };
  }, [token, logout, resetHerd]);

  return null;
}