import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('pdfnerd_token') || localStorage.getItem('pdfinity_token');
    const storedUser = localStorage.getItem('pdfnerd_user') || localStorage.getItem('pdfinity_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveSession = (newToken, newUser) => {
    localStorage.setItem('pdfnerd_token', newToken);
    localStorage.setItem('pdfnerd_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const login = useCallback(async (email, password) => {
    const { data } = await authService.login({ email, password });
    saveSession(data.token, data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await authService.register({ name, email, password });
    saveSession(data.token, data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pdfnerd_token');
    localStorage.removeItem('pdfnerd_user');
    localStorage.removeItem('pdfinity_token');
    localStorage.removeItem('pdfinity_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authService.getMe();
      setUser(data.user);
      localStorage.setItem('pdfnerd_user', JSON.stringify(data.user));
    } catch {
      logout();
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
