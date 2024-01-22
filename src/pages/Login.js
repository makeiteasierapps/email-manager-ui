import { useContext } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
    useTheme,
} from '@mui/material';
import { GitHub, LockOutlined } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { auth, AuthContext } from '../context/AuthContext';

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),
});

const Login = () => {
    const { setUser, signInWithGithub } = useContext(AuthContext);
    const theme = useTheme();

    const handleLogin = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            setUser(user);
        } catch (error) {
            console.error(
                'There has been a problem with your login operation:',
                error
            );
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => handleLogin(values.email, values.password),
    });

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
                sx={{
                    
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Email Manager
                </Typography>
                <Box
                    component="form"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.password &&
                            Boolean(formik.errors.password)
                        }
                        helperText={
                            formik.touched.password && formik.errors.password
                        }
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<GitHub />}
                        onClick={() => {
                            signInWithGithub(setUser);
                        }}
                        sx={{ mt: 2 }}
                    >
                        Sign In with Github
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
