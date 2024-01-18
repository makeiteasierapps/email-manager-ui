import { useContext, useState } from 'react';
import { AuthContext, auth } from '../context/AuthContext';
import { Box, Button, TextField, Typography } from '@mui/material';
import {
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    console.log(user);

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

    return (
        <Box
            display="flex"
            flexDirection="column"
            width="50%"
            gap={2}
            alignItems={'center'}
        >
            <Typography variant="h5">{user.email}</Typography>

            <Box display="flex" flexDirection="column" gap>
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
        </Box>
    );
};

export default Profile;
