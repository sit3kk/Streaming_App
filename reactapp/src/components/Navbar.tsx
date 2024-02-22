import React, { useState, useRef, useEffect } from 'react';
import { useLogout } from '../hooks/useLogout';
import { UserData } from '../types/UserData';

interface NavbarProps {
  onSignUpClick: () => void;
  onLoginClick: () => void;
  isAuthenticated: boolean;
  currentUser: UserData | null;
}

const Navbar: React.FC<NavbarProps> = ({
  onSignUpClick,
  onLoginClick,
  isAuthenticated,
  currentUser,
}) => {
  const logout = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Adding a ref for the menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // This effect adds/removes the click listener for closing the menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Only add the listener if the menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup the listener when the component unmounts or when the menu closes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <nav className="bg-neutral-800 text-white fixed top-0 left-0 w-full flex justify-between items-center px-3 py-3 z-50" style={{ borderBottom: '2px solid black' }}>
      <a href="/" className="text-xl font-bold">StreamsPL</a>
      {isAuthenticated && currentUser ? (
        <div className="relative flex items-center">
          <span className="mx-3 text-sm md:text-base align-middle">{currentUser.username}</span>
          <button onClick={toggleMenu} className="px-3 py-2 focus:outline-none hover:bg-gray-700 transition-all ease-in-out duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div ref={menuRef} className={`absolute right-0 top-full mt-2 py-2 w-48 bg-neutral-700 rounded-md shadow-xl z-20 transition-all ease-in-out duration-150 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ right: '0rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', border: '0.5px solid black' }}>
            <button onClick={(e) => { e.preventDefault(); logout(); }} className="w-full text-left block px-4 py-2 text-sm capitalize text-white hover:bg-gray-600 hover:text-white transition-all ease-in-out duration-150">
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div>
          <button onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="px-3 py-2 rounded hover:bg-neutral-700 text-white mr-2">Log In</button>
          <button onClick={(e) => { e.preventDefault(); onSignUpClick(); }} className="px-3 py-2 rounded bg-purple-500 hover:bg-purple-700 text-white mr-2">Sign Up</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
