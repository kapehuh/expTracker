import { createContext } from 'react';
import { type User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
