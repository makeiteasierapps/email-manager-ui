import { createContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [idToken, setIdToken] = useState(null);
    const [uid, setUid] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                user.getIdToken().then(function (token) {
                    setIdToken(token);
                    setUid(user.uid);
                    setUser(user);
                });
            } else {
                console.log('No user is signed in.');
            }
        });
    }, []);


    return (
        <AuthContext.Provider value={{ idToken, uid, user }}>
            {children}
        </AuthContext.Provider>
    );
};
