import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckAuthStatus } from '../hooks/useCheckAuthStatus';
import { UserData } from '../types/UserData';
import leftarrow from '../icons/left-arrow.png';
import rightarrow from '../icons/right-arrow.png';


const RoomHost: React.FC = () => {
    const { id } = useParams();
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [showChat, setShowChat] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaStream = useRef<MediaStream | null>(null);

   
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

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setShowChat(window.innerWidth < 768);
        };

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const sendMessage = () => {
        if (isAuthenticated && currentUser && currentMessage.trim() !== '') {
            const ws = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${id}/`);
            ws.onopen = () => {
                const messageData = {
                    username: currentUser.username,
                    message: currentMessage
                };
                ws.send(JSON.stringify(messageData));
                setCurrentMessage('');
            };
        } else {
            alert('You must be logged in to send messages or the message cannot be empty.');
        }
    };

    const startScreenShare = async () => {
        try {
            mediaStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream.current;
            }
        } catch (error) {
            console.error("Error sharing the screen:", error);
        }
    };

    const stopScreenShare = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    };

    const handleFullScreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            videoRef.current.volume = Number(event.target.value);
        }
    };

    const handleChatToggle = () => {
        setShowChat(prevState => !prevState);
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





    return (
        <div className="container mx-auto flex flex-col lg:flex-row p-4 h-full mt-16 ">
            <div className="flex flex-col lg:flex-row flex-grow">
                <div className={`stream flex-grow ${showChat ? (isMobile ? 'lg:w-full' : 'lg:w-9/12') : 'lg:w-full'} h-full bg-black relative`}>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full"></video>
                    <div className="absolute bottom-4 left-4 flex space-x-2">
                        <button onClick={startScreenShare} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                            Start Streaming
                        </button>
                        <button onClick={stopScreenShare} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                            Stop Streaming
                        </button>
                        <button onClick={handleFullScreen} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
                            Full Screen
                        </button>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        onChange={handleVolumeChange}
                        className="absolute bottom-4 right-4 w-24"
                    />
                </div>


        
                
                {/* Button to toggle chat visibility - Only show if not in mobile view */}
                {!isMobile && (
                    <button
                        onClick={handleChatToggle}
                        style={{
                            position: 'absolute',
                            top: '100px',
                            right: showChat ? '3500px' : '10px',
                            transform: 'translateY(-50%)',
                        }}
                        className="bg-neutral-800 hover:bg-gray-700 rounded text-white font-bold py-2 px-3 transition-transform duration-500 ease-in-out"
                    >
                        {showChat ? '>' : <img src={leftarrow} alt="left-arrow" style={{ width: '20px', height: '20px' }} />}
                    </button>
                )}

                <div className={`chat mt-16 lg:w-2/12 bg-neutral-800 text-white overflow-hidden ${isMobile ? 'fixed bottom-0 left-0 w-full' : 'absolute inset-y-0 right-0 p-4 transition-all'} ${showChat ? 'opacity-100 visible' : 'opacity-0 invisible w-0 lg:w-0'}`}>

                    <div className="chat-header flex justify-between items-center ">



                        {isMobile ? ("") : (
                            <button
                                onClick={handleChatToggle}
                                className=" bg-neutral-800 hover:bg-gray-700 text-white rounded font-bold py-2 px-3 transition-transform duration-500 ease-in-out"
                            >
                                <img src={rightarrow} alt="right-arrow" style={{ width: '20px', height: '20px' }} />

                            </button>)}


                        <h2 className="text-xl font-bold">Chat</h2>

                    </div>

                    {isMobile ? (

                        <div className="chat-messages overflow-y-auto space-y-2 mt-4 border-t border-grey-700"
                            style={{ height: '40vh' }}
                        >
                            {messages.map((msg, index) => (
                                <div key={index} className="flex items-center mt-3">
                                    <div className="bg-gray-600 p-2 rounded-lg">
                                        <p className="text-white">{msg}</p>
                                    </div>
                                </div>

                            ))}
                        </div>
                    ) :
                        (
                            <div className="chat-messages overflow-y-auto space-y-2 mt-4 border-t border-grey-700"
                            style={{ height: '75vh' }}>
                                {messages.map((msg, index) => (
                                    <div key={index} className="flex items-center mt-3">
                                        <div className="bg-gray-600 p-2 rounded-lg">
                                            <p className="text-white">{msg}</p>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        )}


                    <div className="chat-input mt-4 flex" >
                        <input
                            type="text"
                            placeholder="Your message..."
                            className="w-full p-2 rounded bg-neutral-700 focus:outline-none focus:ring focus:border-blue-300"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button onClick={sendMessage} className="ml-2 bg-purple-500 p-2 rounded hover:bg-purple-700">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );



};

export default RoomHost;
