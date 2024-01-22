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
import Profile from '../pages/Profile';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { handleUseTrial, value, setValue } = useContext(ManagerContext);
    const theme = useTheme();

    const handleSetValue = (newValue) => {
        setValue(newValue);
        localStorage.setItem('location', newValue);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('location');
        } catch (error) {
            console.error('Error logging out', error);
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {value === 'home' && <Profile />}
                {value === 'emailManager' && <EmailManager />}
                {value === 'dataDash' && <EmailCRMInfoPanel />}
            </Box>
        </Box>
    );
};

export default Home;
