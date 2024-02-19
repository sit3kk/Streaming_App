import { useEffect } from 'react';
import { UserData } from '../types/UserData';


export const useCheckAuthStatus = (
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setCurrentUser: (user: UserData | null) => void
) => {
  useEffect(() => {
    const checkAuthenticatedStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/accounts/authenticated', {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.isAuthenticated === 'success') {
          setIsAuthenticated(true);
          setCurrentUser({ username: data.user });
        } else {
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error checking authenticated status:", error);
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    };

    checkAuthenticatedStatus();
  }, [setIsAuthenticated, setCurrentUser]); 
};

export default useCheckAuthStatus;
