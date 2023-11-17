import React, { useContext, useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes,
    useNavigate,
    Navigate,
} from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import {  AuthContext } from './context/AuthContext';

const AuthenticatedRoutes = () => {
    const navigate = useNavigate();
    const { idToken } = useContext(AuthContext);

    useEffect(() => {
        navigate(idToken ? '/home' : '/login');
    }, [navigate, idToken]);

    return <Home />;
};

const App = () => {
    const { idToken } = useContext(AuthContext);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        setIsAuthorized(!!idToken);
    }, [idToken]);

    return (
        <Router>
                <Routes>
                    {isAuthorized ? (
                        <>
                            <Route
                                path="/home"
                                element={<AuthenticatedRoutes />}
                            />
                            <Route
                                path="*"
                                element={<Navigate replace to="/home" />}
                            />
                        </>
                    ) : (
                        <>
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="*"
                                element={<Navigate replace to="/login" />}
                            />
                        </>
                    )}
                </Routes>
        </Router>
    );
};

export default App;
