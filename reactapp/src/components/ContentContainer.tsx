import React from 'react';

import { Routes, Route } from 'react-router-dom';
import RoomsList from './RoomsList';
import RoomDetail from './RoomDetail';
import RoomCreator from './RoomCreator';



const ContentContainer: React.FC = () => {
    return (
       
            <div className="h-full flex flex-col justify-start items-center bg-neutral-900">
            <Routes>
                <Route path="/" element={<RoomsList />} />
                <Route path="/room/:id" element={<RoomDetail />} />
                <Route path="/RoomCreator" element={<RoomCreator />} />
            </Routes>
            </div>
       
    );
};

export default ContentContainer;
