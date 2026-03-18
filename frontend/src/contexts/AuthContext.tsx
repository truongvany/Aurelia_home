import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, clearAuthSession, hasAuthSession, setAuthSession } from '../lib/api';
import type { User } from '../types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshMe: () => Promise<void>;
  applyAuthPayload: (payload: { accessToken: string; refreshToken: string; user: User }) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    if (!hasAuthSession()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const me = await api.me();
      setUser(me);
    } catch {
      clearAuthSession();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const applyAuthPayload = useCallback((payload: { accessToken: string; refreshToken: string; user: User }) => {
    setAuthSession(payload);
    setUser(payload.user);
  }, []);

  const signOut = useCallback(() => {
    clearAuthSession();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      refreshMe,
      applyAuthPayload,
      signOut
    }),
    [user, isLoading, refreshMe, applyAuthPayload, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Gracefully fall back when AuthProvider is not mounted.
    // This prevents crashes for components that rely on useAuth but are rendered outside the provider.
    console.warn('useAuth called outside of AuthProvider, returning guest defaults.');
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      refreshMe: async () => {},
      applyAuthPayload: () => {},
      signOut: () => {}
    };
  }
  return context;
}
