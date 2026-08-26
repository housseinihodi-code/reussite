import { createContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type LoginPayload, type RegisterPayload } from '@/services/auth.service';
import { tokenStorage } from '@/utils/storage';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setUser, clearUser } from '@/redux/slices/authSlice';
import type { User } from '@/types/user.types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  becomeSeller: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const [user, setLocalUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!tokenStorage.getAccessToken()) {
        setIsLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setLocalUser(profile);
        dispatch(setUser(profile));
      } catch {
        tokenStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };
    bootstrap();
  }, [dispatch]);

  const login = async (payload: LoginPayload) => {
    const result = await authService.login(payload);
    tokenStorage.setTokens(result.accessToken, result.refreshToken);
    setLocalUser(result.user);
    dispatch(setUser(result.user));
  };

  const register = async (payload: RegisterPayload) => {
    const result = await authService.register(payload);
    tokenStorage.setTokens(result.accessToken, result.refreshToken);
    setLocalUser(result.user);
    dispatch(setUser(result.user));
  };

  const becomeSeller = async () => {
    const result = await authService.becomeSeller();
    tokenStorage.setTokens(result.accessToken, result.refreshToken);
    setLocalUser(result.user);
    dispatch(setUser(result.user));
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      tokenStorage.clear();
      setLocalUser(null);
      dispatch(clearUser());
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, becomeSeller }}>
      {children}
    </AuthContext.Provider>
  );
}
