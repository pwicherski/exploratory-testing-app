import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import "./index.css";

const renderApp = () => {
  try {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('React app has finished rendering');
  } catch (error) {
    console.error('Error rendering React app:', error);
  }
};

// Ensure the DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// Error handling for script loading
window.addEventListener('error', (event) => {
  if (event.message.includes('Loading module') || event.message.includes('Loading failed for the module')) {
    console.error('Script loading error:', event.message);
    // You can add additional error handling or user notification here
  }
});