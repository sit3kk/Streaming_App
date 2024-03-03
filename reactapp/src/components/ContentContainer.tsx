import React from 'react';

import { Routes, Route } from 'react-router-dom';
import RoomsList from './RoomsList';
//import RoomDetail from './RoomDetail';

import RoomHost from './RoomHost.jsx';
import ProfileDetails from './ProfileDetails';
import RoomCreator from './RoomCreator.tsx';
//import RoomViewer from './StreamingRoom.jsx';





const ContentContainer: React.FC = () => {
    return (
       
            <div className="min-h-screen flex flex-col justify-start items-center bg-neutral-900">
            <Routes>
                <Route path="/" element={<RoomsList />} />
                <Route path="/room/:id" element={<RoomHost />} />
                <Route path="/RoomCreator" element={<RoomCreator/>} />
                <Route path="Profile" element={< ProfileDetails />} />
            </Routes>
            </div>
       
    );
};

export default ContentContainer;
