import React, { createContext, useState, ReactNode} from 'react';
import { UserData } from '../types/UserData';


interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserData | null; 
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setCurrentUser: (user: UserData | null) => void; 
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, setIsAuthenticated, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 

