import { useState } from 'react';
import { Toolbar, IconButton, AppBar, Box } from '@mui/material';
import MailIcon from '@mui/icons-material/Mail';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { signOut } from 'firebase/auth';
import { auth } from '../context/AuthContext';
import EmailManager from '../components//emailManager/EmailManager';
import EmailCRMInfoPanel from '../components/datadash/EmailCRMInfoPanel';
import Profile from '../pages/Profile';

import { ManagerProvider } from '../components/emailManager/ManagerContext';

const Home = () => {
    const [value, setValue] = useState(0);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log('Logged out');
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
                            onClick={() => setValue(0)}
                        >
                            <PersonIcon />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="send"
                            onClick={() => setValue(1)}
                        >
                            <MailIcon />
                        </IconButton>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="info"
                            onClick={() => setValue(2)}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Box>

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
                {value === 0 && <Profile />}
                {value === 1 && (
                    <ManagerProvider>
                        <EmailManager />
                    </ManagerProvider>
                )}
                {value === 2 && <EmailCRMInfoPanel />}

            </Box>
        </Box>
    );
};

export default Home;
