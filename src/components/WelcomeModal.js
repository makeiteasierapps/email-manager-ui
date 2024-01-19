// In a new file, e.g., src/components/MailgunConfigModal.js
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
    const { user } = useContext(AuthContext);

    console.log(user);
    const handleUseTrial = () => {
        // Set the API key and domain to admin account
        // You will need to implement the logic to set these values

        onClose();
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
