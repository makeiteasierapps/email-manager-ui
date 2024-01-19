import { useContext } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    getAdditionalUserInfo,
} from 'firebase/auth';
import axios from 'axios';
import {
    Avatar,
    Button,
    TextField,
    Box,
    Typography,
    Container,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useFormik } from 'formik';
import * as yup from 'yup';
import { AuthContext } from '../context/AuthContext';
import { auth, provider } from '../context/AuthContext';

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

const signInWithGithub = async (setUser) => {
    try {
        const result = await signInWithPopup(auth, provider);

        const additionalUserInfo = getAdditionalUserInfo(result);
        const isNewUser = additionalUserInfo.isNewUser;

        if (isNewUser) {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/profile/create`,
                    {
                        uid: result.user.uid,
                    }
                );
                setUser({
                    uid: result.user.uid,
                    photoURL: result.user.photoURL,
                    displayName: result.user.displayName,
                    ...response.data,
                });
            } catch (error) {
                console.error(
                    `There has been a problem with your fetch operation ${error}`
                );
            }
        } else {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/profile`,
                    {
                        params: {
                            uid: result.user.uid,
                        },
                    }
                );
                setUser({
                    uid: result.user.uid,
                    photoURL: result.user.photoURL,
                    displayName: result.user.displayName,
                    ...response.data,
                });
            } catch (error) {
                console.error(
                    `There has been a problem with your fetch operation: ${error}`
                );
            }
        }
    } catch (error) {
        console.error(
            'There has been a problem with your login operation:',
            error
        );
    }
};

const Login = () => {
    const { setUser } = useContext(AuthContext);

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
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
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
                        startIcon={<GitHubIcon />}
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
