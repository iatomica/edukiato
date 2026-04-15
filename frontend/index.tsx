import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Cache Buster mechanism to force clearing old data (e.g., non-anonymized names)
const CURRENT_VERSION = 'v1.2.0-demo';
if (localStorage.getItem('edu_app_version') !== CURRENT_VERSION) {
  localStorage.clear();
  localStorage.setItem('edu_app_version', CURRENT_VERSION);
  window.location.reload();
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);