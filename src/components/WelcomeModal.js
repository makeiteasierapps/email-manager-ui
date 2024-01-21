import { useContext } from 'react';

import { ManagerContext } from './emailManager/ManagerContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

const MailgunConfigModal = ({ open, setShowWelcomeModal }) => {
    const { handleUseTrial, setValue } = useContext(ManagerContext);

    return (
        <Dialog open={open} onClose={() => setShowWelcomeModal(false)}>
            <DialogTitle>Mailgun Configuration</DialogTitle>
            <DialogContent>You know what to do</DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        handleUseTrial();
                        setShowWelcomeModal(false);
                        setValue('emailManager');
                        localStorage.setItem('location', 'emailManager');
                    }}
                >
                    Start Trial
                </Button>
                <Button onClick={() => setShowWelcomeModal(false)}>
                    Provide My Own
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MailgunConfigModal;
