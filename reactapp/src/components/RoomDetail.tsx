import React from 'react';
import { useParams } from 'react-router-dom';

const RoomDetail: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="container mx-auto flex p-4 h-screen mt-16">
            <div className="flex flex-col md:flex-row flex-grow">
                <div className="stream flex-grow bg-black">
                    {/* Załóżmy, że tutaj będzie odtwarzacz video */}
                    <div className="text-white p-4">Stream place for room: {id}</div>
                </div>
                <div className="chat w-2.5/12 bg-neutral-800 text-white overflow-hidden fixed right-0 top-16 bottom-0">
                    <div className="chat-messages overflow-y-auto p-4 space-y-4  h-[70%]">
                        {/* Wiadomości użytkowników */}
                        <div className="chat-message">Chat room: {id}</div>
                        {/* Powtórz dla każdej wiadomości */}
                    </div>
                    <div className="chat-input p-4 h-[15%]">
                        <input type="text" placeholder="Your message..." className="w-full p-2 rounded bg-neutral-700 focus:outline-none focus:ring focus:border-blue-300" />
                        <button className="w-full mt-2 bg-purple-500 p-2 rounded hover:bg-purple-700">Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
