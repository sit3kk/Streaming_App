import { useEffect } from 'react';
import { UserData } from '../types/UserData';
import { v4 as uuidv4 } from 'uuid';



export const useCheckAuthStatus = (
  setIsAuthenticated: (isAuthenticated: boolean) => void,
  setCurrentUser: (user: UserData | null) => void
) => {
  useEffect(() => {

    const sessionidFromCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('sessionid='))
    ?.split('=')[1];    

    const checkAuthenticatedStatus = async () => {
      try {

        
        const API_URL = process.env.REACT_APP_API_KEY

        console.log(API_URL + `/accounts/authenticated`)


        const response = await fetch(API_URL + `/accounts/authenticated`, {
          method: "GET",
          credentials: "include",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'sessionid': sessionidFromCookie || '',
        },  
        
        });
        const data = await response.json();

      
        if (data.isAuthenticated === 'success') {
          setIsAuthenticated(true);
          setCurrentUser({ username: data.user });
        } else {
          setIsAuthenticated(false);

          setCurrentUser({ username: uuidv4()} );
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
