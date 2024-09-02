import React from 'react';
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null,
    React.createElement(App)
  )
);

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