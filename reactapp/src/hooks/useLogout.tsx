import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext.tsx';

export const useLogout = () => {
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext)!;

  const csrftoken = document.cookie.split('; ')
  .find(row => row.startsWith('csrftoken='))
  ?.split('=')[1];

 
  const logout = async () => {
    try {

    
      const response = await fetch("http://127.0.0.1:8000/api/accounts/logout", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken || '', 
            },
        body: JSON.stringify({'withCredentials': true}),
        credentials: "include",
      });

      console.log('Logout response:', response);    
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      
      setIsAuthenticated(false);
      setCurrentUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return logout;
};
