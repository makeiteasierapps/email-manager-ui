import { useContext } from 'react';
import { styled } from '@mui/system';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    useMediaQuery,
    useTheme,
    List,
    ListItem,
    Typography,
    Box,
    Link,
} from '@mui/material';

import { ManagerContext } from './emailManager/ManagerContext';
import ListItemIcon from '@mui/material/ListItemIcon';
import {
    Mail,
    Mode,
    Webhook,
    Storage,
    FactCheck,
    Redeem,
    Engineering,
    GitHub,
} from '@mui/icons-material';

const StyledListItemIcon = styled(ListItemIcon)({
    minWidth: '2.7rem',
});

const MailgunConfigModal = ({ open, setShowWelcomeModal }) => {
    const { handleUseTrial, setValue } = useContext(ManagerContext);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Dialog
            open={open}
            fullScreen={fullScreen}
            sx={{
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', marginTop: '1.3rem' }}>
                <Typography variant="h4" fontWeight="bold">
                    Welcome To Email Manager
                </Typography>
            </DialogTitle>
            <DialogContent
                sx={{
                    textAlign: 'center',
                    margin: '.6rem 0 0 0',
                    paddingBottom: '0',
                }}
            >
                <Typography fontWeight="bold">
                    Thanks for stopping by and checking out my project! At the
                    core this app sends emails using Mailgun, but with a fun AI
                    twist.
                    <br /> Below is a quick break down:
                </Typography>
                <List sx={{ listStyleType: 'none', margin: '1rem 0 0 0' }}>
                    <ListItem>
                        <StyledListItemIcon>
                            <Mail />
                        </StyledListItemIcon>
                        Users can send emails individually or in bulk using CSV
                        files.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <Mode />
                        </StyledListItemIcon>
                        There is an option to write custom messages or use
                        predefined templates.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <Webhook />
                        </StyledListItemIcon>
                        Emails have a webhook for replies, which triggers an AI
                        response considering the context of the received email.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <Storage />
                        </StyledListItemIcon>
                        Interactions are saved in a database to provide
                        continuity and context for AI responses.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <FactCheck />
                        </StyledListItemIcon>
                        Users can monitor conversations to check for any
                        inaccurate information.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <Redeem />
                        </StyledListItemIcon>
                        The app offers a trial with 5 free emails, and users can
                        also provide their own Mailgun credentials.
                    </ListItem>
                    <ListItem>
                        <StyledListItemIcon>
                            <Engineering />
                        </StyledListItemIcon>
                        The project is a side project and may undergo frequent
                        changes, including data persistence.
                    </ListItem>
                    <ListItem
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            margin: '.2rem 0 1rem 0',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            {[
                                {
                                    label: 'Client',
                                    href: 'https://github.com/makeiteasierapps/email-manager-ui',
                                },
                                {
                                    label: 'Server',
                                    href: 'https://github.com/makeiteasierapps/email-manager/tree/main/node_version',
                                },
                            ].map((repo, index) => (
                                <Link
                                    key={index}
                                    href={repo.href}
                                    underline="none"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginRight: index === 0 ? '1rem' : '0',
                                    }}
                                >
                                    <GitHub sx={{ marginRight: '.5rem' }} />
                                    <Typography variant="body2">
                                        {repo.label}
                                    </Typography>
                                </Link>
                            ))}
                        </Box>
                    </ListItem>
                </List>
                <Typography>
                    To continue either enter your mailgun credentials are start
                    a trial
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', padding: '0' }}>
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
