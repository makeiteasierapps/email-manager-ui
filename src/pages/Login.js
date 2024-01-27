import { useContext, useEffect } from 'react';
import { Paper, Box, Typography, Container, useTheme } from '@mui/material';
import { GitHub, LinkedIn } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { ManagerContext } from '../context/ManagerContext';

import MySnackBar from '../components/SnackBar';

const Login = () => {
    const { signInWithGithub, signInWithLinkedIn } = useContext(AuthContext);
    const { showSnackbar, snackbarInfo, hideSnackbar } =
        useContext(ManagerContext);
    const theme = useTheme();

    const handleSignInWithLinkedIn = async () => {
        window.location = `${process.env.REACT_APP_BACKEND_URL}/auth/linkedin`;
    };

    const getTokenFromUrl = () => {
        return new URLSearchParams(window.location.search).get('token');
    };

    useEffect(() => {
        const token = getTokenFromUrl();
        if (token) {
            signInWithLinkedIn(token, showSnackbar);
        }
    }, [showSnackbar, signInWithLinkedIn]);

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
                gap={2}
            >
                <Typography
                    component="h1"
                    fontSize={{ xs: '2.5rem', sm: '2.8rem', md: '3.5rem' }}
                    fontWeight={'bold'}
                    fontFamily={'BioRhyme'}
                    color={'secondary'}
                    sx={{
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Email Manager
                </Typography>

                <Paper
                    onClick={() => {
                        signInWithGithub(showSnackbar);
                    }}
                    elevation={9}
                    sx={{
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
                        color={'secondary'}
                        sx={{
                            filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))',
                            fontSize: 66,
                        }}
                    />
                    <Typography
                        variant="h6"
                        color={'secondary'}
                        sx={{
                            mt: 1,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        Sign In with Github
                    </Typography>
                </Paper>
                <Paper
                    onClick={handleSignInWithLinkedIn}
                    elevation={9}
                    sx={{
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
                    <LinkedIn
                        color={'secondary'}
                        sx={{
                            fontSize: 66,
                            filter: 'drop-shadow(2px 4px 4px rgba(0,0,0,0.5))',
                        }}
                    />
                    <Typography
                        variant="h6"
                        color={'secondary'}
                        sx={{
                            mt: 1,
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        }}
                    >
                        Sign In with LinkedIn
                    </Typography>
                </Paper>
            </Box>
            <MySnackBar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                severity={snackbarInfo.severity}
                handleClose={hideSnackbar}
            />
        </Container>
    );
};

export default Login;
