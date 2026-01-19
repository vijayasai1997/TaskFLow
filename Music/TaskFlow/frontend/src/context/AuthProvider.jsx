import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    const res = await authAPI.register({ username, email, password, confirmPassword: password });
    if (res.success) {
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};