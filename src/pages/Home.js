import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import EmailForm from '../components/EmailForm';

export default function Home() {
    
    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <EmailForm />
            </Box>
        </Container>
    );
}
