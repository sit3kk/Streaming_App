import { useState, useEffect } from 'react';
import { Room } from '../types/Room';
import { Link } from 'react-router-dom';

const RoomsList: React.FC = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    useEffect(() => {

        const fetchRooms = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/api/rooms/list_rooms", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Room[] = await response.json();


                console.log(data);
                setRooms(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchRooms();
    }, []);

    const sortRooms = () => {
        const sortedRooms = [...rooms].sort((a, b) => b.viewers - a.viewers);
        setRooms(sortedRooms);
    };

    return (
        <div className="flex flex-col justify-center items-center bg-neutral-900 mt-16">
            <div className="max-w-screen-lg w-full mx-auto bg-neutral-900 rounded-lg p-8">
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

                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rooms.map(room => (
                        <li key={room.room_id} className="bg-neutral-800 rounded-lg p-5 hover:bg-gray-600 transition duration-150 ease-in-out">
                            <Link to={`/room/${room.room_id}`} className="text-white">
                                <p className="font-bold">{room.room_name}</p>
                                <p className="text-gray-400 text-sm mt-2">Topic: {room.room_topic}</p>
                                <p className="text-gray-400 text-sm mt-2">{room.room_description}</p>
                                <div className="flex items-center mt-4">
                                    <span className="bg-red-600 text-xs font-bold mr-2 px-2.5 py-0.5 rounded">LIVE</span>

                                    <span className="text-gray-300 text-xs">{room.viewers} watching now</span>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default RoomsList;