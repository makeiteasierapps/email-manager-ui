import { useContext, useState, useEffect } from 'react';
import { PuffLoader } from 'react-spinners/';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ManagerContext } from '../context/ManagerContext';
import MySnackBar from '../components/SnackBar';
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    Backdrop,
} from '@mui/material';

import WelcomeModal from '../components/WelcomeModal';

const Profile = () => {
    const { showSnackbar, hideSnackbar, snackbarInfo } =
        useContext(ManagerContext);
    const { user, setUser } = useContext(AuthContext);
    const [mailgunApiKey, setMailgunApiKey] = useState('');
    const [mailgunDomain, setMailgunDomain] = useState('');

    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/profile/update`,
                {
                    uid: user.uid,
                    mailgunApiKey,
                    mailgunDomain,
                }
            );

            const updatedUser = {
                ...user,
                mailgunApiKey: response.data,
                mailgunDomain,
            };
            setUser(updatedUser);

            // Update local storage with new user details
            localStorage.setItem('user', JSON.stringify(updatedUser));

            showSnackbar('Profile updated successfully!', 'success');
            setMailgunApiKey('');
            setMailgunDomain('');
        } catch (error) {
            console.error(error);
            let errorMessage = 'Failed to update profile';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    useEffect(() => {
        if (user) {
            if (!user.onTrial && !user.hasMailgunConfig) {
                setShowWelcomeModal(true);
            }
        }
    }, [user]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            width="70%"
            marginTop={5}
            gap={2}
            alignItems={'center'}
        >
            {user === null ? (
                <Backdrop
                    open={true}
                    style={{
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                >
                    <PuffLoader color="black" size={100} />
                </Backdrop>
            ) : (
                // Once user is populated, render the profile information
                <>
                    <Box
                        display="flex"
                        flexDirection="row"
                        gap={3}
                        alignItems="center"
                    >
                        <Avatar
                            src={user.photoURL}
                            sx={{ width: 77, height: 77 }}
                        />
                        <Typography color={'white'} variant="h5">
                            {user.displayName || 'Guest'}
                        </Typography>
                    </Box>
                </>
            )}

            <Box display="flex" flexDirection="column" gap width="100%">
                <TextField
                    label="Mailgun API Key"
                    type="password"
                    value={mailgunApiKey}
                    onChange={(e) => setMailgunApiKey(e.target.value)}
                />

                <TextField
                    label="Domain i.e. shauno.co or mg.shauno.co"
                    value={mailgunDomain}
                    onChange={(e) => setMailgunDomain(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdateProfile}
                >
                    Save
                </Button>
            </Box>

            <WelcomeModal
                open={showWelcomeModal}
                setShowWelcomeModal={setShowWelcomeModal}
            />
            <MySnackBar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                severity={snackbarInfo.severity}
                handleClose={hideSnackbar}
            />
        </Box>
    );
};

export default Profile;
