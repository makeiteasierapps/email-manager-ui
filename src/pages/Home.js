import { useContext } from 'react';
import {
    Toolbar,
    IconButton,
    AppBar,
    Box,
    Button,
    useTheme,
} from '@mui/material';

import { Person, ExitToApp, Info, Mail } from '@mui/icons-material';

import { signOut } from 'firebase/auth';
import { AuthContext, auth } from '../context/AuthContext';
import { ManagerContext } from '../context/ManagerContext';
import EmailManager from '../components/emailManager/EmailManager';
import EmailCRMInfoPanel from '../components/datadash/EmailCRMInfoPanel';
import MySnackBar from '../components/SnackBar';
import Profile from '../pages/Profile';

const Home = () => {
    const { user } = useContext(AuthContext);

    const {
        handleUseTrial,
        value,
        setValue,
        showSnackbar,
        snackbarInfo,
        hideSnackbar,
    } = useContext(ManagerContext);
    const theme = useTheme();
    document.body.style.backgroundColor = theme.palette.background.main;

    const handleSetValue = (newValue) => {
        setValue(newValue);
        localStorage.setItem('location', newValue);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('location');
        } catch (error) {
            console.error(error);
            let errorMessage = 'Failed to log out';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    return (
        <Box
            component="main"
            sx={{ height: '100vh', width: '100vw' }}
            backgroundColor={theme.palette.background.main}
        >
            <AppBar position="static">
                <Toolbar>
                    <Box flexGrow={1}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="send"
                            onClick={() => handleSetValue('home')}
                        >
                            <Person />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="send"
                            onClick={() => handleSetValue('emailManager')}
                        >
                            <Mail />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="info"
                            onClick={() => handleSetValue('dataDash')}
                        >
                            <Info />
                        </IconButton>
                    </Box>
                    {user && !user.onTrial && !user.hasMailgunConfig ? (
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                component="div"
                                onClick={handleUseTrial}
                            >
                                Start Trial
                            </Button>
                        </Box>
                    ) : null}
                    <IconButton
                        color="inherit"
                        aria-label="logout"
                        onClick={handleLogout}
                    >
                        <ExitToApp />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box display="flex" flexDirection="column" alignItems="center">
                {value === 'home' && <Profile />}
                {value === 'emailManager' && <EmailManager />}
                {value === 'dataDash' && <EmailCRMInfoPanel />}
            </Box>
            <MySnackBar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                severity={snackbarInfo.severity}
                handleClose={hideSnackbar}
            />
        </Box>
    );
};

export default Home;
