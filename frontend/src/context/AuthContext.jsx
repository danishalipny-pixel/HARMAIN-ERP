import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('harmain_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('harmain_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('harmain_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification error:', err);
          // Fallback to local user or keep session alive
        }
      }
      setLoading(false);
    }
    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('harmain_token', res.token);
      localStorage.setItem('harmain_user', JSON.stringify(res.user));
    }
    return res;
  };

  const switchRole = async (role) => {
    try {
      const res = await api.switchRole(role);
      if (res.success) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('harmain_token', res.token);
        localStorage.setItem('harmain_user', JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      console.error('Role switch error:', err);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('harmain_token');
    localStorage.removeItem('harmain_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, login, switchRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
