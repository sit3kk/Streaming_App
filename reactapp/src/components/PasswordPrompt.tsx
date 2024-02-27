import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


interface PasswordPromptProps {
  roomId: string;

  onClose: () => void;
}

const PasswordPrompt: React.FC<PasswordPromptProps> = ({ roomId, onClose }) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const naviagate = useNavigate();


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handlePasswordSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/rooms/join_room', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          "sessionid": document.cookie.split('; ').find(row => row.startsWith('sessionid='))?.split('=')[1] || "",
          "X-CSRFToken": document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || "",
        },
        body: JSON.stringify({ room_id: roomId, room_password: password }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to join room');
      }

      naviagate(`/room/${roomId}`)

     
      onClose();
    } catch (error) {
      console.error('Error joining room:', error);
      setErrorMessage('Failed to join room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div
        ref={formRef}
        className="bg-neutral-900 p-8 rounded-lg space-y-6 w-full max-w-md"
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-white mb-2">Enter Room Password</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-3xl rounded-full"
          >
            &times;
          </button>
        </div>
        {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-neutral-800 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
            placeholder="Password"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 w-full rounded"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordPrompt;
