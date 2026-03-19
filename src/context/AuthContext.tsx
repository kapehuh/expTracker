import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { type User } from 'firebase/auth';
import { AuthContext } from './authContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ✅ эффект для отладки
  useEffect(() => {
    if (currentUser) {
      console.log('👤 Текущий пользователь (AuthProvider):', currentUser.email, currentUser.uid);
    } else {
      console.log('👤 Пользователь не авторизован');
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>{!loading && children}</AuthContext.Provider>
  );
};
