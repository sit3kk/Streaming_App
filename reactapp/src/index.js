import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App.tsx';
import './index.css';

// React 18 way to mount the App
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Create a root.
root.render(<App />);

