import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

console.log('[COSMOLYTICS] Starting application...');

try {
  const rootEl = document.getElementById('root');
  if (!rootEl) {
    console.error('[COSMOLYTICS] Root element not found!');
  } else {
    console.log('[COSMOLYTICS] Root element found, creating React root...');
    const root = ReactDOM.createRoot(rootEl);
    console.log('[COSMOLYTICS] Root created, rendering...');
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
    console.log('[COSMOLYTICS] Render called successfully');
  }
} catch (error) {
  console.error('[COSMOLYTICS] Fatal error during initialization:', error);
  const rootEl = document.getElementById('root');
  if (rootEl) {
    rootEl.innerHTML = `<div style="color: red; padding: 20px; font-family: monospace;"><h1>COSMOLYTICS Error</h1><pre>${error}</pre></div>`;
  }
}
