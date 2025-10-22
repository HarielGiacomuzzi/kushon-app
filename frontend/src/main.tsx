import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { logger } from './utils/logger'

// Log application startup
logger.startup('🚀 Starting Kushon Frontend Application...');
logger.startup('═'.repeat(60));

// Log environment information
logger.startup('📦 Application Info', {
  name: 'Kushon Frontend',
  version: '1.0.0',
  environment: import.meta.env.MODE,
  nodeEnv: import.meta.env.NODE_ENV,
});

// Log configuration
logger.startup('⚙️  Configuration', {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});

// Log browser information
logger.startup('🌐 Browser Info', {
  userAgent: navigator.userAgent,
  language: navigator.language,
  platform: navigator.platform,
  onLine: navigator.onLine,
});

// Log viewport information
logger.startup('📱 Viewport', {
  width: window.innerWidth,
  height: window.innerHeight,
  devicePixelRatio: window.devicePixelRatio,
});

// Check if required DOM element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error('Startup', 'Root element not found! Cannot mount React application.');
  throw new Error('Root element #root not found');
}

logger.startup('✅ Root element found, mounting React application...');

try {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  logger.startup('✅ React application mounted successfully!');
  logger.startup('═'.repeat(60));
} catch (error) {
  logger.error('Startup', 'Failed to mount React application', error);
  throw error;
}

// Log when the app is fully loaded
window.addEventListener('load', () => {
  logger.startup('✅ Application fully loaded!');
});

// Log network status changes
window.addEventListener('online', () => {
  logger.info('Network', '✅ Connection restored - Back online');
});

window.addEventListener('offline', () => {
  logger.warn('Network', '⚠️  Connection lost - Application is offline');
});

// Log unhandled errors
window.addEventListener('error', (event) => {
  logger.error('Global Error', 'Unhandled error occurred', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error,
  });
});

// Log unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Global Error', 'Unhandled promise rejection', {
    reason: event.reason,
  });
});
