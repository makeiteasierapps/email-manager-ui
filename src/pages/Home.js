import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EmailForm from '../components/email/EmailForm';
import EmailCRMInfoPanel from '../components/datadash/EmailCRMInfoPanel';

const Home = () => {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Container component="main" sx={{ height: '100vh', width: '100%' }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                >
                    <Tab label="Send" />
                    
                    <Tab label="Email Info" />
                </Tabs>
                {value === 0 && <EmailForm />}
                {value === 1 && <EmailCRMInfoPanel />}
            </Box>
        </Container>
    );
}

export default Home;
