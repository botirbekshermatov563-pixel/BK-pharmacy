import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Supabase Auth listener
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Local fallback auth
      const savedUser = localStorage.getItem('bk_admin_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } else {
      // Demo / Local fallback validation
      if ((email === 'admin@bk-pharmacy.uz' && password === 'admin123') || (email && password.length >= 6)) {
        const dummyUser = { id: 'admin-local-1', email, role: 'authenticated' };
        setUser(dummyUser);
        localStorage.setItem('bk_admin_user', JSON.stringify(dummyUser));
        return { user: dummyUser };
      }
      throw new Error('Неверный email или пароль (для демо: admin@bk-pharmacy.uz / admin123)');
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('bk_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: Boolean(user), loading, login, logout, isSupabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
