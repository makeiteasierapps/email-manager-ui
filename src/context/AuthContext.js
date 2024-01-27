import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    GithubAuthProvider,
    signInWithPopup,
    getAdditionalUserInfo,
    signInWithCustomToken,
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
const auth = getAuth(app);
const provider = new GithubAuthProvider();
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [idToken, setIdToken] = useState(null);
    const [user, setUser] = useState(null);

    const signInWithGithub = async (showSnackbar) => {
        try {
            const result = await signInWithPopup(auth, provider);
            const additionalUserInfo = getAdditionalUserInfo(result);
            const isNewUser = additionalUserInfo.isNewUser;

            if (isNewUser) {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_BACKEND_URL}/profile/create`,
                        {
                            uid: result.user.uid,
                        }
                    );
                    const userData = {
                        uid: result.user.uid,
                        photoURL: result.user.photoURL,
                        displayName: result.user.displayName,
                        ...response.data,
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                } catch (error) {
                    console.error(error);
                    let errorMessage = 'Failed to create user profile';
                    if (error.response && error.response.data) {
                        errorMessage = error.response.data;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                    showSnackbar(errorMessage, 'error');
                }
            } else {
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL}/profile`,
                        {
                            params: {
                                uid: result.user.uid,
                            },
                        }
                    );
                    setUser({
                        uid: result.user.uid,
                        photoURL: result.user.photoURL,
                        displayName: result.user.displayName,
                        ...response.data,
                    });
                } catch (error) {
                    console.error(error);
                    let errorMessage = 'Failed to retrieve user profile';
                    if (error.response && error.response.data) {
                        errorMessage = error.response.data;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                    showSnackbar(errorMessage, 'error');
                }
            }
        } catch (error) {
            console.error(error);
            let errorMessage = 'Login failed';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    const signInWithLinkedIn = async (token, showSnackbar) => {
        try {
            const result = await signInWithCustomToken(auth, token);
            // Handle the result of the sign-in
            const userData = {
                uid: result.user.uid,
                photoURL: result.user.photoURL,
                displayName: result.user.displayName,
                // You might want to fetch or set additional user data here
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error(error);
            let errorMessage = 'Login failed with token';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    const fetchUserData = useCallback(async (uid) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_URL}/profile`,
                { params: { uid } }
            );
            return response.data;
        } catch (error) {
            console.error(error);
            alert('Failed to fetch user data. Please try again later.');
            return null;
        }
    }, []);

    useEffect(() => {
        const rehydrateOnMount = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } else if (auth.currentUser) {
                // If there's a current user but no data in local storage, fetch from backend
                const backendData = await fetchUserData(auth.currentUser.uid);
                if (backendData) {
                    const userData = {
                        uid: auth.currentUser.uid,
                        photoURL: auth.currentUser.photoURL,
                        displayName: auth.currentUser.displayName,
                        ...backendData,
                    };
                    setUser(userData);
                    localStorage.setItem('user', JSON.stringify(userData));
                }
            }
        };

        rehydrateOnMount();
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            console.log('user', user);
            if (user) {
                const token = await user.getIdToken();
                setIdToken(token);
            } else {
                setIdToken(null);
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('location');
            }
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                idToken,
                user,
                setUser,
                signInWithGithub,
                signInWithLinkedIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext, auth, provider };
