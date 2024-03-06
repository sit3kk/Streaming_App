import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';
import camera from '../icons/camera.png';
import shareScreen from '../icons/share-screen.png';
import microphone from '../icons/microphone.png';
import microphoneMuted from '../icons/microphone-muted.png';
import stopRecording from '../icons/stop-recording.png';




const RoomStream = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();

    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [viewersList, setViewersList] = useState([]);
    const [isHost, setIsHost] = useState(false);
    const [roomAllowed, setRoomAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);



    useEffect(() => {
        (async () => {

            const roomToken = `room_${id}_token`;


            const API_URL = process.env.REACT_APP_API_KEY

            try {
                const response = await fetch(API_URL + "rooms/room_access", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "X-CSRFToken": document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || "",
                        "sessionid": document.cookie.split('; ').find(row => row.startsWith('sessionid='))?.split('=')[1] || "",
                    },
                    credentials: "include",
                    body: JSON.stringify({ room_id: id, username: currentUser?.username, room_token: localStorage.getItem(roomToken) })

                });


                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setRoomAllowed(true);
                }


            } catch (error) {
                console.error('You cant join to the room', error);
            }
        })();


    }, [id]);

    useEffect(() => {

        if (isAuthenticated && currentUser) {


            (async () => {
                try {

                    const API_URL = process.env.REACT_APP_API_KEY

                    const response = await fetch(API_URL + "/rooms/is_room_owner", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            "X-CSRFToken": document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1] || "",
                            "sessionid": document.cookie.split('; ').find(row => row.startsWith('sessionid='))?.split('=')[1] || "",
                        },
                        credentials: "include",
                        body: JSON.stringify({ room_id: id })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setIsHost(data.is_owner);
                    }


                } catch (error) {
                    console.error('Failed to check if the user is the host:', error);
                }
            })();
        }





    }, [id, isAuthenticated, currentUser]);


    useEffect(() => {

        const WS_URL = process.env.REACT_APP_WS_URL

        const ws = new WebSocket(WS_URL + `/chat/${id}/`);

        ws.onopen = () => {
            console.log('WebSocket Connected');
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.disable_message) {

                return;
            }

            if (data.type === 'viewers_list') {
                const filteredViewersList = data.viewers_list.filter((viewer) => viewer !== "");
                setViewersList(filteredViewersList);
                return;
            }

            if (data.type === 'anonymous_users_count') {
                console.log('Anonymous users count:', data.anonymous_users_count);
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

            const WS_URL = process.env.REACT_APP_WS_URL

            const ws = new WebSocket(WS_URL + `/chat/${id}/`);
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



    const messagesEndRef = useRef < HTMLDivElement > (null);


    useEffect(() => {
        if (!roomAllowed) return;

        try {

            if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === 'function') {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Failed to scroll to the latest messages:', error);
        }
    }, [messages, messagesEndRef]);



    {/* WebRTC Part Host */ }

    const pubVideo = useRef();
    const subVideo = useRef();

    const signalRef = useRef(null);
    const clientRef = useRef(null);


    const [isMuted, setIsMuted] = useState(false);


    const [streamLive, setStreamLive] = useState(false);




    useEffect(() => {

        if (!roomAllowed) return;

        const config = {
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        };

        
        

        signalRef.current = new IonSFUJSONRPCSignal("ws://localhost:7000/ws");
        clientRef.current = new Client(signalRef.current, config);
        signalRef.current.onopen = () => clientRef.current.join(id);


        if (!isHost) {
            clientRef.current.ontrack = (track, stream) => {

                track.onunmute = () => {

                    setStreamLive(true);

                    if (subVideo.current) {

                        subVideo.current.srcObject = stream;
                        subVideo.current.autoplay = true;
                        subVideo.current.muted = false;


                        stream.onremovetrack = () => {
                            if (subVideo.current) {

                                subVideo.current.srcObject = null;
                            }
                        };
                    } else {
                        console.log("subVideo.current is null.");
                    }
                };
            };
        }

    }, [isHost, id, streamLive,]);


    const toggleMute = () => {
        const stream = pubVideo.current?.srcObject;
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            if (audioTracks.length > 0) {
                const isCurrentlyMuted = !audioTracks[0].enabled;
                audioTracks.forEach((track) => {
                    track.enabled = !track.enabled;
                });
                setIsMuted(isCurrentlyMuted);
            } else {
                console.error('No audio tracks found in the stream.');
            }
        }
    };


    const stopStream = () => {

        const stream = pubVideo.current.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => {
                track.stop();
            });
            pubVideo.current.srcObject = null;
            window.location.reload();
        }
    };

    const updateStream = (isCamera) => {

        stopStream();
        start(isCamera);
    };




    const start = (event) => {
        if (event) {

            LocalStream.getUserMedia({
                resolution: 'fhd',
                audio: true,
                video: true,
                codec: 'vp8',
                simulcast: true,
                frameRate: 60,
            }).then((media) => {
                pubVideo.current.srcObject = media;
                pubVideo.current.autoplay = true;
                pubVideo.current.controls = true;
                pubVideo.current.muted = true
                clientRef.current.publish(media);
            }).catch(console.error);


        } else {

            LocalStream.getDisplayMedia({
                resolution: 'fhd',
                video: true,
                audio: true,
                codec: 'vp8',
                simulcast: true,
                frameRate: 60,

            }).then((media) => {
                pubVideo.current.srcObject = media;
                pubVideo.current.autoplay = true;
                pubVideo.current.controls = true;
                pubVideo.current.muted = true
                clientRef.current.publish(media);
            }).catch(console.error);

        }

    }


    return (


        <div>

            {isLoading ? (
                <>
               
                        <div className="fixed top-16 left-0 w-full h-[calc(100%-4rem)] flex bg-neutral-600">

                            <div className="flex-none w-1/6 max-w-xs h-full overflow-y-auto bg-neutral-800"></div>
                            <div className="flex-grow h-full bg-neutral-900"></div>
                            <div className="flex-none w-1/4 max-w-sm h-full bg-neutral-800 flex flex-col"></div>
                            </div>
                </>
            ) : (
                <>
                    {roomAllowed || isHost ? (
                        <div className="fixed top-16 left-0 w-full h-[calc(100%-4rem)] flex bg-neutral-600">

                            <div className="flex-none w-1/6 max-w-xs h-full overflow-y-auto bg-neutral-800">
                                <h2 className="p-4 text-lg text-white border-neutral-700 bold">Users online</h2>
                                <ul className="list-none m-0 p-0">
                                    {viewersList.map((user, index) => (
                                        <li key={index} className="flex justify-between items-center p-5 hover:bg-neutral-700 cursor-pointer">
                                            <span className="text-white">{user}</span>
                                            <span className="h-3 w-3 bg-green-500 rounded-full "></span>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            <div className="flex-grow h-full bg-neutral-900">

                                {isHost ? (
                                    <div className="flex flex-col justify-between h-full">
                                        {streamLive ? (
                                            <video id="pubVideo" className="bg-black w-full h-full object-cover" controls ref={pubVideo}></video>

                                        ) : (
                                            <div className="flex-grow flex items-center justify-center bg-neutral-900">
                                                <div className="text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-5.172m-2.828 0a2 2 0 100-4 2 2 0 000 4zm2.828-4V4m0 0L5 20m9-16l5 16" />
                                                    </svg>
                                                    <p className="text-white text-2xl mt-4">Stream Offline</p>
                                                </div>
                                            </div>
                                        )}
                                        <header className="bg-neutral-800 flex justify-center p-4 space-x-4 ">

                                            <button className="hover:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-lg " onClick={() => {
                                                setStreamLive(true)
                                                setTimeout(() => {
                                                    start(true);
                                                    updateStream(true);
                                                }, 100);
                                            }}>
                                                <img src={camera} alt="Publish Camera" className="w-6 h-6" />
                                            </button>
                                            <button className="hover:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-lg" onClick={() => {
                                                setStreamLive(true)
                                                setTimeout(() => {
                                                    start(false);
                                                    updateStream(false);

                                                }, 100);
                                            }}>
                                                <img src={shareScreen} alt="Publish Screen" className="w-6 h-6" />
                                            </button>
                                            <button className="hover:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-lg" onClick={toggleMute}>
                                                <img src={isMuted ? microphone : microphoneMuted} alt={isMuted ? 'Mute' : 'Unmute'} className="w-6 h-6" />
                                            </button>
                                            <button className="hover:bg-gray-700 p-2 rounded-lg flex items-center justify-center shadow-lg" onClick={stopStream}>
                                                <img src={stopRecording} alt="Stop Stream" className="w-6 h-6" />
                                            </button>
                                        </header>



                                    </div>

                                ) :
                                    <div className="flex flex-col justify-between h-full">
                                        {streamLive ? (
                                            <video id="pubVideo" className="bg-black w-full h-full object-cover" controls ref={pubVideo}></video>

                                        ) : (
                                            <div className="flex-grow flex items-center justify-center bg-neutral-900">
                                                <div className="text-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-5.172m-2.828 0a2 2 0 100-4 2 2 0 000 4zm2.828-4V4m0 0L5 20m9-16l5 16" />
                                                    </svg>
                                                    <p className="text-white text-2xl mt-4">Stream Offline</p>
                                                </div>
                                            </div>
                                        )}


                                    </div>
                                }


                            </div>

                            <div className="flex-none w-1/4 max-w-sm h-full bg-neutral-800 flex flex-col">

                                <h3 className="text-white text-xl p-4 border-b border-neutral-700">Chat of the Room</h3>

                                <div className="chat-messages overflow-y-auto p-4 space-y-2 flex-grow" style={{ height: 'calc(100% - 8rem)' }}>
                                    {messages.map((msg, index) => (
                                        <div key={index} className="flex items-start space-x-2">
                                            <div className="bg-gray-600 p-3 rounded-lg">
                                                <p className="text-white text-sm">{msg}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

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
                    ) : (
                        <div className="flex-grow flex items-center justify-center bg-neutral-900 h-screen">
                            <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>

                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-1.414 1.414M15.536 9.879l-1.415-1.414m0 0a2 2 0 11-2.828 2.828 2 2 0 012.828-2.828zm0 0L12.707 8.464m4.95-2.828l1.414-1.414a9 9 0 11-12.727 0l1.414 1.414m1.414 1.414L8.464 12.707a2 2 0 103.536 0L12.707 8.464zm0 0l1.415 1.414" />

                                </svg>
                                <p className="text-white text-3xl mt-8">You don't have permissions to join to this room.</p>
                            </div>
                        </div>


                    )}

                </>
            )}





        </div>
    );




};

export default RoomStream;
