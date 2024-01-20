import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

const MailgunConfigModal = ({ open, onClose }) => {
    const { user, setUser } = useContext(AuthContext);

    const handleUseTrial = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/start-trial`,
                {
                    uid: user.uid,
                    onTrial: true,
                }
            );
            const { mailgunApiKey, mailgunDomain } = response.data;

            const updatedUser = {
                ...user,
                onTrial: true,
                mailgunApiKey,
                mailgunDomain,
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            onClose();
            console.log(user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleProvideOwn = () => {
        // Redirect to profile page or open a form to enter API key and domain

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Mailgun Configuration</DialogTitle>
            <DialogContent>
                {/* Content explaining the options */}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleUseTrial}>Start Trial</Button>
                <Button onClick={handleProvideOwn}>Provide My Own</Button>
            </DialogActions>
        </Dialog>
    );
};

export default MailgunConfigModal;
