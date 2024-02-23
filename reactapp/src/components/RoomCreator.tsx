import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const RoomCreator: React.FC = () => {
    const [roomName, setRoomName] = useState<string>("");
    const [roomTopic, setRoomTopic] = useState<string>("");
    const [roomDescription, setRoomDescription] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<boolean>(false);
    const [roomPassword, setRoomPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        if (!roomName || !roomTopic || !roomDescription) {
            setErrorMessage("Please fill in all fields.");
            return;
        }
        if (isPrivate && !roomPassword) {
            setErrorMessage("Please enter a password for the private room.");
            return;
        }

        const newRoom = {
            room_name: roomName,
            room_topic: roomTopic,
            room_description: roomDescription,
            private: isPrivate,
            room_password: isPrivate ? roomPassword : "",
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/rooms/create_room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || "",
                },
                credentials: "include",
                body: JSON.stringify(newRoom),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || `HTTP error! Status: ${response.status}`);
                return;
            }

            const data = await response.json();
            console.log(data.success);
            navigate(`/room/${data.room}`);
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("An error occurred while creating the room.");
        }
    };

    return (
        <div className="flex flex-col w-3/4 justify-center items-center bg-neutral-900 mt-32">
            <div className="max-w-screen-lg w-full mx-auto bg-neutral-800 rounded-lg p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Create a New Room
                </h2>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-white">
                        Room Name
                    </label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="bg-neutral-700 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
                        placeholder="Enter room name"
                    />

                    <label
                        htmlFor="roomTopic"
                        className="block mb-2 text-sm font-medium text-white"
                    >
                        Room Topic
                    </label>
                    <input
                        id="roomTopic"
                        type="text"
                        maxLength={100}
                        value={roomTopic}
                        onChange={(e) => setRoomTopic(e.target.value)}
                        className="bg-neutral-700 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
                        placeholder="Enter room topic"
                    />

                    <label
                        htmlFor="roomDescription"
                        className="block mb-2 text-sm font-medium text-white"
                    >
                        Room Description
                    </label>
                    <textarea
                        id="roomDescription"
                        value={roomDescription}
                        onChange={(e) => setRoomDescription(e.target.value)}
                        className="bg-neutral-700 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
                        placeholder="Enter room description"
                        maxLength={500}
                        rows={4}
                    ></textarea>

                    <div className="flex items-center space-x-3 mb-4">
                        <input
                            id="privateRoom"
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(e) => setIsPrivate(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-purple-600 rounded bg-neutral-700 border-gray-700"
                        />
                        <label
                            htmlFor="privateRoom"
                            className="text-sm font-medium text-white"
                        >
                            Private Room
                        </label>
                    </div>

                    {isPrivate && (
                        <input
                            type="text"
                            value={roomPassword}
                            onChange={(e) => setRoomPassword(e.target.value)}
                            className="bg-neutral-700 text-white p-3 rounded-lg w-full border border-gray-700 focus:border-purple-600 focus:ring focus:ring-purple-600 focus:ring-opacity-50"
                            placeholder="Enter room password"
                            maxLength={20}
                        />
                    )}

                    <div className="flex justify-end space-x-4">
                        <Link to="/" className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-lg"
                        >
                            Create Room
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default RoomCreator;
