import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange } from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      const configuredAdmin = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
      const currentEmail = (firebaseUser?.email || '').trim().toLowerCase();
      if (firebaseUser && (!configuredAdmin || currentEmail === configuredAdmin)) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
