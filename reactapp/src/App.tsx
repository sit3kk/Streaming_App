import { useState, useEffect} from "react";
import Navbar from "./components/Navbar";
import { CSRFTokenProvider } from './components/CSRFToken';
import RegistrationForm from "./components/RegistrationForm";
import LoginForm from "./components/LoginForm";
import "./index.css";
import { useCheckAuthStatus } from './hooks/useCheckAuthStatus.tsx';
import { UserData } from './types/UserData';
import { AuthProvider } from './contexts/AuthContext.tsx';
import LoadingScreen from "./components/LoadingScreen";
import ContentContainer from "./components/ContentContainer.tsx";
import Footer from "./components/Footer.tsx";
import { BrowserRouter } from 'react-router-dom';




function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
 


  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200); 
  }, []);
  


  const onLoginSuccess = (userData: UserData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setIsLoginOpen(false);
  };

 
  const onSignUpSuccess = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

 
  const handleSignUpClick = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };


  const handleLoginClick = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };


  useCheckAuthStatus(setIsAuthenticated, setCurrentUser);


  return (

    <div className="h-full">
       <BrowserRouter>
      <AuthProvider>
      {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
          <CSRFTokenProvider>
            <Navbar
              onSignUpClick={() => setIsRegisterOpen(true)}
              onLoginClick={handleLoginClick}
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
           
             
            />

            <ContentContainer/>
          

              {isRegisterOpen && (
                <RegistrationForm
                  onClose={() => setIsRegisterOpen(false)}
                  onSignUpSuccess={onSignUpSuccess}
                  onLoginClick={handleLoginClick}
                />
              )}
              {isLoginOpen && (
                <LoginForm
                  onClose={() => setIsLoginOpen(false)}
                  onSignUpClick={handleSignUpClick}
                  onLoginSuccess={onLoginSuccess}
                />
              )}
               </CSRFTokenProvider>
            
            <div className={`${isRegisterOpen || isLoginOpen ? "filter blur-lg" : ""}`}></div>
          </>
          
        )}
      </AuthProvider>
      <Footer /> 
      </BrowserRouter>
    </div>
    
  );
}

export default App;
