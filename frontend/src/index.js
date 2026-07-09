import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// This looks for the <div id="root"></div> in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);