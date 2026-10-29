import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/layout/ErrorBoundary.jsx';
import { LangProvider } from './context/LangContext.jsx';
import './index.css';
import './styles/skins/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LangProvider>
        <App />
      </LangProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
