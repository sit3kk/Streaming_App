import React, { useState, useEffect, useRef } from "react";
import { useCSRFToken } from './CSRFToken'
import { UserData } from '../types/UserData';


interface LoginFormProps {
  onClose: () => void;
  onSignUpClick: () => void;
  onLoginSuccess: (data: UserData) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSignUpClick, onLoginSuccess }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [shake, setShake] = useState<boolean>(false);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

 
  const csrftoken = useCSRFToken();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setShake(false);
    

  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/login", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '', 
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

  
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      
      setTimeout(() => {
        onLoginSuccess(data);
      }, 500);
      
      window.location.reload();
    } catch (err) {
      console.error("Error logging in:", err);
      setErrorMessage("Invalid username or password");
      setShake(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        ref={formRef}
        className={`bg-neutral-900 p-8 rounded-lg space-y-6 w-full max-w-md ${
          shake ? "animate-shake" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white mb-2">Log in</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-3xl rounded-full"
          >
            &times;
          </button>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border ${
              errorMessage ? "border-red-500" : "border-gray-700"
            } focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              shake ? "shake" : ""
            }`}
            placeholder="Username"
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border ${
              errorMessage ? "border-red-500" : "border-gray-700"
            } focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              shake ? "shake" : ""
            }`}
            placeholder="Password"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 w-full rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
          <p className="text-center text-sm text-gray-200">
            Don’t have an account?&nbsp;
            <button
              onClick={(event) => {
                event.preventDefault();
                onSignUpClick();
              }}
              className="text-purple-600 hover:text-purple-400 focus:outline-none"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
