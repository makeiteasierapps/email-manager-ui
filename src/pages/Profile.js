import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext, auth } from '../context/AuthContext';
import {
    Box,
    Button,
    TextField,
    Typography,
    Avatar,
    IconButton,
    Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';

import WelcomeModal from '../components/WelcomeModal';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [mailgunApiKey, setMailgunApiKey] = useState('');
    const [mailgunDomain, setMailgunDomain] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    const handleUpdatePassword = async () => {
        // Reauthenticate before updating the password
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            currentPassword
        );

        try {
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, newPassword);
            setNewPassword('');
            setCurrentPassword('');
            alert('Password updated successfully!');
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

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

            alert('Profile updated successfully!');
            setMailgunApiKey('');
            setMailgunDomain('');
        } catch (error) {
            console.error(error);
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
            width="50%"
            marginTop={2}
            gap={2}
            alignItems={'center'}
        >
            <Box display="flex" flexDirection="row" gap alignItems="center">
                {user && (
                    <>
                        <Avatar src={user.photoURL} />
                        <Typography variant="h5">{user.displayName}</Typography>
                    </>
                )}
            </Box>

            <Box display="flex" flexDirection="column" gap>
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

            <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                <IconButton
                    onClick={() => setExpanded(!expanded)}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </IconButton>
                <Typography onClick={() => setExpanded(!expanded)}>
                    Change Password
                </Typography>
            </Box>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box display="flex" flexDirection="row" gap alignItems="center">
                    <TextField
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="Current Password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpdatePassword}
                    >
                        Change Password
                    </Button>
                </Box>
            </Collapse>
            <WelcomeModal
                open={showWelcomeModal}
                onClose={() => setShowWelcomeModal(false)}
            />
        </Box>
    );
};

export default Profile;
