import { useState } from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MailIcon from '@mui/icons-material/Mail';
import InfoIcon from '@mui/icons-material/Info';
import EmailManager from '../components//emailManager/EmailManager';
import EmailCRMInfoPanel from '../components/datadash/EmailCRMInfoPanel';

import { ManagerProvider } from '../components/emailManager/ManagerContext';

const Home = () => {
    const [value, setValue] = useState(0);

    return (
        <Box component="main" sx={{ height: '100vh', width: '100%' }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="send"
                        onClick={() => setValue(0)}
                    >
                        <MailIcon />
                    </IconButton>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="info"
                        onClick={() => setValue(1)}
                    >
                        <InfoIcon />
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
                {value === 0 && (
                    <ManagerProvider>
                        <EmailManager />
                    </ManagerProvider>
                )}
                {value === 1 && <EmailCRMInfoPanel />}
            </Box>
        </Box>
    );
};

export default Home;
