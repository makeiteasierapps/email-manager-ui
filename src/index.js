import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ManagerProvider } from './context/ManagerContext';
import MyThemeProvider from './Theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <CssBaseline />
        <MyThemeProvider>
            <AuthProvider>
                <ManagerProvider>
                    <App />
                </ManagerProvider>
            </AuthProvider>
        </MyThemeProvider>
    </React.StrictMode>
);
