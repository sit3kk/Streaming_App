import React, { useState, useRef, useEffect } from "react";
import { useCSRFToken } from './CSRFToken'
import '../index.css'

interface RegistrationFormProps {
  onClose: () => void;
  onSignUpSuccess: () => void;
  onLoginClick: () => void; 
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onClose, onSignUpSuccess, onLoginClick }) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const csrftoken = useCSRFToken();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let hasError = false;

    if (!username) {
      setUsernameError(true);
      hasError = true;
    } else {
      setUsernameError(false);
    }
    if (!email) {
      setEmailError(true);
      hasError = true;
    } else {
      setEmailError(false);
    }
    if (!password) {
      setPasswordError(true);
      hasError = true;
    } else {
      setPasswordError(false);
    }
    if (password !== confirmPassword || !confirmPassword) {
      setConfirmPasswordError(true);
      setPasswordError(true);
      setErrorMessage("Passwords don't match");
      hasError = true;
    } else {
      setConfirmPasswordError(false);
    }

    if (hasError) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/accounts/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken
        },
        body: JSON.stringify({
          username,
          email,
          password,
          re_password: confirmPassword
        }),
        credentials: "include"
      });
      const data = await response.json();

      if (response.ok) {
        console.log("User registered:", data);
        onSignUpSuccess();
      } else {
        if (data.error && data.error.includes("Username already exists")) {
          setUsernameError(true);
          setErrorMessage("Username already exists.");
        } else if (data.error && data.error.includes("Email already exists")) {
          setEmailError(true);
          setErrorMessage("Email already exists.");
        } else {
          setErrorMessage("An error occurred, please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("An error occurred, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`bg-neutral-900 p-8 rounded-lg space-y-6 w-full max-w-md ${
          errorMessage ? "animate-shake" : ""
        }`}
      >
        <div className="flex justify-between items-center pb-3 border-b border-gray-700">
          <h2 className="text-center text-3xl font-bold text-white">Join Us</h2>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-200 p-2 text-3xl rounded-full transition-opacity duration-300 ease-in-out"
          >
            &times;
          </button>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        <div className="space-y-6">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              usernameError ? "error-shake error-highlight" : ""
            }`}
            placeholder="Username"
            disabled={isSubmitting}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              emailError ? "error-shake error-highlight" : ""
            }`}
            placeholder="Email"
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              passwordError ? "error-shake error-highlight" : ""
            }`}
            placeholder="Password"
            disabled={isSubmitting}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`bg-neutral-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50 ${
              confirmPasswordError ? "error-shake error-highlight" : ""
            }`}
            placeholder="Confirm Password"
            disabled={isSubmitting}
          />
        </div>
        <div className="pt-4 border-t border-gray-700">
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 w-full rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-200">
          Already have an account?&nbsp;
          <button
            onClick={(event) => {
              event.preventDefault();
              onLoginClick();
            }}
            className="text-purple-600 hover:text-purple-400 focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}

export default RegistrationForm;

