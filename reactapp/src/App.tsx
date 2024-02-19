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


function App() {
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 200); 
  }, []);
  


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Call this function when the user logs in successfully
  const onLoginSuccess = (userData: UserData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setIsLoginOpen(false);
  };

  // Call this function when the user signs up successfully
  const onSignUpSuccess = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  // Function to handle the Sign Up click within the LoginForms
  const handleSignUpClick = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // Function to handle the Login click within the Navbar
  const handleLoginClick = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  useCheckAuthStatus(setIsAuthenticated, setCurrentUser);

  return (
    <div >
      <AuthProvider>
      {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Navbar
              onSignUpClick={() => setIsRegisterOpen(true)}
              onLoginClick={handleLoginClick}
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              onToggleSidebar={toggleSidebar}
            />
            <CSRFTokenProvider>
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
    </div>
  );
}

export default App;
