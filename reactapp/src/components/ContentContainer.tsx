import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import RoomsList from './RoomsList';
import RoomDetail from './RoomDetail';



const ContentContainer: React.FC = () => {
    return (
        <BrowserRouter>
            <div className="h-full flex flex-col justify-start items-center bg-neutral-900">
            <Routes>
            <Route path="/" element={<RoomsList />} />
                <Route path="/room/:id" element={<RoomDetail />} />
            </Routes>
            </div>
        </BrowserRouter>

    );
};

export default ContentContainer;
