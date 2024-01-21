import { useContext } from 'react';
import { Toolbar, IconButton, AppBar, Box, Button } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signOut } from 'firebase/auth';
import { AuthContext, auth } from '../context/AuthContext';
import { ManagerContext } from '../components/emailManager/ManagerContext';
import EmailManager from '../components//emailManager/EmailManager';
import EmailCRMInfoPanel from '../components/datadash/EmailCRMInfoPanel';
import Profile from '../pages/Profile';

const Home = () => {
    const { user } = useContext(AuthContext);
    const { handleUseTrial, value, setValue } = useContext(ManagerContext);

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
        <Box component="main" sx={{ height: '100vh', width: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <Box flexGrow={1}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="send"
                            onClick={() => handleSetValue('home')}
                        >
                            <PersonIcon />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="send"
                            onClick={() => handleSetValue('emailManager')}
                        >
                            <MailIcon />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="info"
                            onClick={() => handleSetValue('dataDash')}
                        >
                            <InfoIcon />
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
                        <ExitToAppIcon />
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
