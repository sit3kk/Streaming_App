import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client, LocalStream } from 'ion-sdk-js';
import { IonSFUJSONRPCSignal } from 'ion-sdk-js/lib/signal/json-rpc-impl';






const RoomStream = ({ isAuthenticated, currentUser }) => {
    const { id } = useParams();
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [viewersList, setViewersList] = useState([]);
    const [isHost, setIsHost] = useState(false);


    useEffect(() => {

        if (isAuthenticated && currentUser) {


            (async () => {
                try {
                    const response = await fetch("http://127.0.0.1:8000/api/rooms/is_room_owner", {
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



    const messagesEndRef = useRef < HTMLDivElement > (null);


    useEffect(() => {
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
    //const [resolution, setResolution] = useState('vga');
    //const [codec, setCodec] = useState('vp8');
    //const [frameRate, setFrameRate] = useState(60);

    const [streamLive, setStreamLive] = useState(true);




    useEffect(() => {

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


        setStreamLive(true);
        if (!isHost) {
            clientRef.current.ontrack = (track, stream) => {

                track.onunmute = () => {
                    
                    console.log("Stream is live.")
                    

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
                        console.log("subVideo.current jest null.");
                    }
                };
            };
        }

       




    }, [isHost, id]);


    const toggleMute = () => {
        const stream = pubVideo.current.srcObject;
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !isMuted;
            });
            setIsMuted(!isMuted);
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
        }
    };

    const updateStream = (isCamera) => {

        stopStream();


        start(isCamera);
    };


    const start = (event) => {
        if (event) {
         
         
            LocalStream.getUserMedia({
                resolution: 'qhd',
                audio: true,
                codec: "h264",
                frameRate: 60,
            }).then((media) => {
                pubVideo.current.srcObject = media;
                pubVideo.current.autoplay = true;
                pubVideo.current.controls = true;
                pubVideo.current.muted = true;
                clientRef.current.publish(media);
            }).catch(console.error);
        } else {
            
            LocalStream.getDisplayMedia({
                resolution: 'qhd',
                video: true,
                audio: true,
                codec: "h264",
                frameRate: 60,
            }).then((media) => {
                pubVideo.current.srcObject = media;
                pubVideo.current.autoplay = true;
                pubVideo.current.controls = true;
                pubVideo.current.muted = true;
                clientRef.current.publish(media);
            }).catch(console.error);
        }
    }




    return (



        <div className="fixed top-16 left-0 w-full h-[calc(100%-4rem)] flex bg-neutral-600">

            <div className="flex-none w-1/6 max-w-xs h-full overflow-y-auto bg-neutral-800">
                <h2 className="p-4 text-lg text-white border-neutral-700 bold">You are watching with</h2>
                <ul className="list-none m-0 p-0">
                    {viewersList.map((user, index) => (
                        <li key={index} className="flex justify-between items-center p-5 hover:bg-neutral-700 cursor-pointer">
                            <span className="text-white">{user}</span>
                            <span className="h-3 w-3 bg-green-500 rounded-full "></span>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="flex-grow h-full bg-black">

                {isHost ? (
                    <>
                        <video id="pubVideo" className="bg-black w-full" controls ref={pubVideo}></video>
                        <div>

                        </div>
                        <header>
                            <button className="bg-blue-500 px-4 py-2 text-white rounded-lg mr-5" onClick={() => start(true)}>
                                Publish Camera
                            </button>
                            <button className="bg-green-500 px-4 py-2 text-white rounded-lg" onClick={() => start(false)}>
                                Publish Screen
                            </button>
                            <button className="bg-yellow-500 px-4 py-2 text-white rounded-lg mr-5" onClick={toggleMute}>
                                {isMuted ? 'Unmute' : 'Mute'} Microphone
                            </button>
                            <button className="bg-red-500 px-4 py-2 text-white rounded-lg" onClick={stopStream}>
                                Stop Stream
                            </button>

                            <button className="bg-purple-500 px-4 py-2 text-white rounded-lg" onClick={() => updateStream(true)}>Update Camera</button>
                        </header>

                    </>
                ) :
                    (
                        <>
                            {streamLive ? (
                                <video id="subVideo" className="bg-black w-full" controls ref={subVideo}></video>
                            ) :
                                (
                                    <div className="flex items-center justify-center h-full bg-neutral-900">
                                        <div className="text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 20H4a2 2 0 01-2-2V6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2h-5.172m-2.828 0a2 2 0 100-4 2 2 0 000 4zm2.828-4V4m0 0L5 20m9-16l5 16" />
                                            </svg>
                                            <p className="text-white text-2xl mt-4">Stream Offline</p>
                                        </div>
                                    </div>


                                )}

                        </>

                    )
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
    );








};

export default RoomStream;
