import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CSRFTokenContextType {
  csrftoken: string;
}


const CSRFTokenContext = createContext<CSRFTokenContextType>({ csrftoken: '' });


export const useCSRFToken = () => useContext(CSRFTokenContext).csrftoken;


interface CSRFTokenProviderProps {
  children: ReactNode;
}

export const CSRFTokenProvider: React.FC<CSRFTokenProviderProps> = ({ children }) => {
  const [csrftoken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    const tokenFromCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

  

    if (tokenFromCookie) {
      setCsrfToken(tokenFromCookie);
    } else {
  
      const fetchCsrfToken = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/accounts/csrf_cookie`, {
            method: 'GET',
            credentials: "include",
          });

          if (response.ok) {
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('csrftoken='))
              ?.split('=')[1];
            if (token) {
              setCsrfToken(token);
            }
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error("Error fetching CSRF cookie:", error);
        }
      };

      fetchCsrfToken();
    }
  }, []);

  return (
    <CSRFTokenContext.Provider value={{ csrftoken }}>
      {children}
    </CSRFTokenContext.Provider>
  );
};
