import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckAuthStatus } from '../hooks/useCheckAuthStatus';
import { UserData } from '../types/UserData';






const RoomHost: React.FC = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [currentMessage, setCurrentMessage] = useState('');
    const [viewersList, setViewersList] = useState<string[]>([]);


    useCheckAuthStatus(setIsAuthenticated, setCurrentUser);


    useEffect(() => {


        const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);

        

        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.disable_message) {
                alert('You must be logged in to send messages.');
                return;
            }

            if (data.type === 'viewers_list') {
                
                console.log(data.viewers_list);
                setViewersList(data.viewers_list);
                return;
            }
    

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

   
    



    

    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        try {

            if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Failed to scroll to the latest messages:', error);
        }
    }, [messages]);



    {/* WebRTC Part Host */ }





    return (
        <div className="fixed top-16 left-0 w-full h-[calc(100%-4rem)] flex bg-neutral-600">
            {/* Sekcja lista użytkowników */}
            <div className="flex-none w-1/6 max-w-xs h-full bg-neutral-800 overflow-y-auto">
                <h2 className="text-white text-lg p-4 border-b border-neutral-700">List of Users</h2>
                <ul>
        {viewersList.map((user, index) => (
            <li key={index} className="text-white p-2">{user}</li>
        ))}
    </ul>
            </div>
    
            {/* Sekcja strumienia (w tym przykładzie pusta) */}
            <div className="flex-grow h-full bg-black"></div>
    
            {/* Sekcja chatu */}
            <div className="flex-none w-1/4 max-w-sm h-full bg-neutral-800 flex flex-col">
                {/* Nagłówek chatu */}
                <h3 className="text-white text-xl p-4 border-b border-neutral-700">Chat of the Room</h3>
                {/* Wiadomości */}
                <div className="chat-messages overflow-y-auto p-4 space-y-2 flex-grow" style={{ height: 'calc(100% - 8rem)' }}>
                    {messages.map((msg, index) => (
                        <div key={index} className="flex items-start space-x-2">
                            <div className="bg-gray-600 p-3 rounded-lg">
                                <p className="text-white text-sm">{msg}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pole wpisywania wiadomości */}
                <div className="chat-input p-4 border-t border-neutral-700 flex items-center">
                    <input
                        type="text"
                        placeholder="Your message..."
                        className="flex-grow p-2 rounded bg-neutral-700 focus:outline-none focus:ring focus:border-blue-300 text-white"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.repeat) {
                                sendMessage();
                            }
                        }}
                    />
                    <button onClick={() => sendMessage()} className="ml-2 bg-purple-500 p-2 rounded hover:bg-purple-700 text-white flex-none">Send</button>
                </div>
            </div>
        </div>
    );
    
    
    





};

export default RoomHost;
