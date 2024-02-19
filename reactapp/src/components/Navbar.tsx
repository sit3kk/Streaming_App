import  React from 'react';
import { useLogout } from '../hooks/useLogout'; 
import { UserData } from '../types/UserData';


interface NavbarProps {
  onSignUpClick: () => void;
  onLoginClick: () => void;
  isAuthenticated: boolean;
  currentUser: UserData | null;
  onToggleSidebar?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSignUpClick,
  onLoginClick,
  isAuthenticated,
  currentUser,
}) => {
  const logout = useLogout(); 

  return (
    <nav className="bg-neutral-800 text-white flex justify-between items-center p-4">
      <a href="/" className="text-xl font-bold">StreamsPL</a>
      {isAuthenticated && currentUser ? (
        <div>
          <a className="px-3 py-2 rounded">Welcome, {currentUser.username}</a>

          <button onClick={(e) => { e.preventDefault(); logout(); }} className="px-3 py-2 rounded bg-purple-500 hover:bg-purple-700 text-white mr-2">Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="px-3 py-2 rounded hover:bg-neutral-700 text-white mr-2">Log In</button>
          <button onClick={(e) => { e.preventDefault(); onSignUpClick(); }} className="px-3 py-2 rounded bg-purple-500 hover:bg-purple-700 text-white mr-2">Sign Up</button>
          <a href="/Settings" className="px-3 py-2 rounded hover:bg-neutral-700">Settings</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;


