import { useContext } from 'react';
import { Paper, Box, Typography, Container, useTheme } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const { setUser, signInWithGithub } = useContext(AuthContext);
    const theme = useTheme();

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                backgroundColor: theme.palette.background.main,
                width: '100vw',
                height: '100vh',
            }}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'center'}
                justifyContent={'center'}
                height={'100vh'}
            >
                <Typography
                    component="h1"
                    fontSize={{ xs: '2.5rem', sm: '2.8rem', md: '3.5rem' }}
                    fontWeight={'bold'}
                    fontFamily={'Grape Nuts'}
                >
                    Email Manager
                </Typography>

                <Paper
                    onClick={() => {
                        signInWithGithub(setUser);
                    }}
                    elevation={4}
                    sx={{
                        mt: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        backgroundColor: theme.palette.background.main,
                        width: '100%',
                        padding: theme.spacing(2),
                        borderRadius: theme.shape.borderRadius,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    }}
                >
                    <GitHub
                        sx={{
                            fontSize: 66,
                            color: theme.palette.text.secondary,
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{ mt: 1, color: theme.palette.text.secondary }}
                    >
                        Sign In with Github
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;
