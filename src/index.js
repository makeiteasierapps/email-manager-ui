import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ManagerProvider } from './components/emailManager/ManagerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <CssBaseline />
        <AuthProvider>
            <ManagerProvider>
                <App />
            </ManagerProvider>
        </AuthProvider>
    </React.StrictMode>
);
