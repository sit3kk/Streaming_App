import React from 'react';

import { Routes, Route } from 'react-router-dom';
import RoomsList from './RoomsList';
//import RoomDetail from './RoomDetail';

import RoomStream from './RoomStream.jsx';
import ProfileDetails from './ProfileDetails';
import RoomCreator from './RoomCreator.tsx';
import { UserData } from '../types/UserData.tsx';




interface ContentContainerProps {
    isAuthenticated: boolean;
    currentUser: UserData | null;
   
  }





const ContentContainer: React.FC<ContentContainerProps> = ({ isAuthenticated, currentUser }) => {
    return (
            
            <div className="min-h-screen flex flex-col justify-start items-center bg-neutral-900">
            <Routes>
                <Route path="/" element={<RoomsList username={currentUser?.username || ''}/>} />
                <Route path="/room/:id" element={<RoomStream 
                isAuthenticated={isAuthenticated}
                currentUser={currentUser}
             
                
                />} />
                <Route path="/RoomCreator" element={<RoomCreator/>} />
                <Route path="Profile" element={< ProfileDetails />} />
            </Routes>
            </div>
       
    );
};

export default ContentContainer;
