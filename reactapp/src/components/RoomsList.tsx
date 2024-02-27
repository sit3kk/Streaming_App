import { useState, useEffect } from "react";
import { Room } from "../types/Room";
import { useNavigate } from "react-router-dom";

import PasswordPrompt from "./PasswordPrompt";

const RoomsList: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(9);
    const [loading, setLoading] = useState(false);
    const [fadeEffect, setFadeEffect] = useState(false);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/rooms/list_rooms",
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                    }
                );

           

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Room[] = await response.json();
         
                setRooms(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const sortRooms = () => {
        setLoading(true);
        const sortedRooms = [...rooms].sort((a, b) => b.viewers - a.viewers);
        setRooms(sortedRooms);
        setLoading(false);
    };


    const handleRoomSelect = (room: Room) => {
        if (room.private) {
            setSelectedRoomId(room.room_id);
            setShowPasswordPrompt(true);
        } else {

            navigate(`/room/${room.room_id}`);
            
            
        }
    };

    const closePasswordPrompt = () => {
        setShowPasswordPrompt(false);
        setSelectedRoomId(null);
    };


    const paginate = (pageNumber: number) => {
        setFadeEffect(true);
        setTimeout(() => {
            setCurrentPage(pageNumber);
            setFadeEffect(false)
        }, 0);
    };

    const totalPages = Math.ceil(rooms.length / roomsPerPage);
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
            pageNumbers.push(i);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            pageNumbers.push("...");
        }
    }

    return (
        <div className="flex flex-col w-3/4 h-full justify-between items-center bg-neutral-900 mt-16">
            

            <div
                className={`max-w-screen-lg w-full h-full mx-auto bg-neutral-900 rounded-lg p-8 flex flex-col ${loading ? 'opacity-50' : 'opacity-100'} ${fadeEffect ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white mb-4">All Rooms</h2>
                    <button
                        onClick={sortRooms}
                        className="text-sm bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700 transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-purple-300"
                        style={{ marginTop: "-0.7rem" }}
                    >
                        Sort by viewers
                    </button>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
                    {currentRooms.map((room) => (
                        <li
                            key={room.room_id}
                            className="flex flex-col justify-between bg-neutral-800 rounded-lg p-5 hover:bg-gray-600 transition duration-150 ease-in-out h-full transform hover:-translate-y-1 hover:scale-105"
                            onClick={() => handleRoomSelect(room)}
                        >
                            <div
                           
                                className="text-white flex flex-col justify-between h-full"
                            >
                                <div>
                                    <p className="font-bold">{room.room_name}</p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Topic: {room.room_topic}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        {room.room_description.length > 100
                                            ? `${room.room_description.substring(0, 100)}...`
                                            : room.room_description}
                                    </p>
                                </div>

                                <div className="flex items-center mt-4 pt-4 border-t border-gray-700">
                                    <span className="bg-red-600 text-xs font-bold mr-2 px-2.5 py-0.5 rounded">
                                        LIVE
                                    </span>
                                    <span className="text-gray-300 text-xs">
                                        {room.viewers} watching now
                                        {room.private == true ? (" (Private)") : ("")}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
                {loading && <div>Loading...</div>}
            {showPasswordPrompt && selectedRoomId && (
                <PasswordPrompt roomId={selectedRoomId} onClose={closePasswordPrompt} />
            )}
            </div>
            <div className="mt-4 pb-4 self-center bottom-20 w-full">
                {totalPages > 0 && (
                    <div className="flex justify-center">
                        {pageNumbers.map((number, index) =>
                            number === "..." ? (
                                <span key={index} className="mx-1 px-4 py-2">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={number}
                                    onClick={() => paginate(Number(number))}
                                    className={`mx-1 px-4 py-2 rounded-md ${currentPage === number
                                        ? "bg-purple-500 text-white"
                                        : "bg-purple-300 text-purple-900"
                                        } transition duration-300 ease-in-out focus:outline-none`}
                                >
                                    {number}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomsList;
