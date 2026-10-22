import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// రూట్ ఎలిమెంట్‌ను కనెక్ట్ చేసి యాప్‌ను రెండర్ చేయడం
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
