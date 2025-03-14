// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import '@fontsource/prompt/300.css'; // Light
import '@fontsource/prompt/400.css'; // Regular
import '@fontsource/prompt/500.css'; // Medium
import '@fontsource/prompt/700.css'; // Bold
import '@fontsource/kanit/400.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);