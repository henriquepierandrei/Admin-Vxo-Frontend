import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { loginAdmin, logoutAdmin } from '../services/authService';
import { setTokens, clearTokens, hasTokens } from '../utils/storage';

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessCode: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(hasTokens());
    setLoading(false);
  }, []);

  const login = useCallback(async (accessCode: string, password: string) => {
    const res = await loginAdmin(accessCode, password);
    setTokens(res.accessToken, res.refreshToken);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await logoutAdmin();
    clearTokens();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}