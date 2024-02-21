import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//import { useContext } from 'react';
//import { AuthContext } from '../contexts/AuthContext';
import { useCheckAuthStatus } from '../hooks/useCheckAuthStatus';
import { UserData } from '../types/UserData';

const RoomDetail: React.FC = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
   // const authContext = useContext(AuthContext);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
   // const [notification, setNotification] = useState('');

    useCheckAuthStatus(setIsAuthenticated, setCurrentUser);

    useEffect(() => {

    
        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const formattedMessage = `${data.username}: ${data.message}`;
            setMessages((prevMessages) => [...prevMessages, formattedMessage]);
        };

        ws.onerror = (e) => {
            console.error(e);
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
        };

        return () => {
            ws.close();
        };
    }, [id]);

    const sendMessage = () => {
        if (isAuthenticated && currentUser) {
            const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);
            if (currentMessage !== '') {
                ws.onopen = () => {
                    const messageData = {
                        username: currentUser?.username, 
                        message: currentMessage
                    };
                    ws?.send(JSON.stringify(messageData));
                };
                setCurrentMessage('');
            }
        } else {
            alert('You must be logged in to send messages.');
        }
    };
    

    return (
        <div className="container mx-auto flex p-4 h-screen mt-16">
            <div className="flex flex-col md:flex-row flex-grow">
                <div className="stream flex-grow bg-black">
                    <div className="text-white p-4">Stream place for room: {id}</div>
                </div>
                <div className="chat w-2.5/12 bg-neutral-800 text-white overflow-hidden fixed right-0 top-16 bottom-0">
                    <div className="chat-messages overflow-y-auto p-4 space-y-4 h-[70%]">
                        {messages.map((msg, index) => (
                            <div key={index} className="chat-message">{msg}</div>
                        ))}
                    </div>
                    <div className="chat-input p-4 h-[15%]">
                <input
                    type="text"
                    placeholder="Your message..."
                    className="w-full p-2 rounded bg-neutral-700 focus:outline-none focus:ring focus:border-blue-300"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button onClick={sendMessage} className="w-full mt-2 bg-purple-500 p-2 rounded hover:bg-purple-700">Send</button>
              
            </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
