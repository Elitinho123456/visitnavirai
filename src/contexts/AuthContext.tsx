import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types/api';
import { API_BASE_URL, apiFetch } from '@/config/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  authenticate: (token: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authenticate = async (token: string) => {
    localStorage.setItem("token", token);
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      const res = await apiFetch(`${API_BASE_URL}/api/users/${decoded.id}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!res.ok) {
        throw new Error("Token inválido ou sessão expirada");
      }
      
      const data = await res.json();
      setUser({ 
        id: decoded.id, 
        name: data.name, 
        email: data.email, 
        role: data.role, 
        permissions: data.permissions, 
        profileImage: data.profileImage 
      });
    } catch (e) {
      console.error("Erro ao ler token:", e);
      localStorage.removeItem("token");
      setUser(null);
      throw e;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authenticate(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, authenticate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
