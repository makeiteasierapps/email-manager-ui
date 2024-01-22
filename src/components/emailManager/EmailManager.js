import { useState } from 'react';
import { Button, Box, Switch, FormControlLabel, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import EmailForm from './form/EmailForm';
import ExtractedDataTable from './dataExtract/ExtractedDataTable';
import FileDropZone from './dataExtract/FileDropZone';
import { useEmailForm } from './form/useEmailForm';

const FormContainer = styled(Box)({
    width: '70%',
});

const EmailManager = () => {
    const emailForm = useEmailForm();
    const theme = useTheme();
    const [isBulk, setIsBulk] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            width={'100%'}
            alignItems={'center'}
        >
            <Box
                display={'flex'}
                justifyContent={'center'}
                gap={2}
                marginTop={5}
                marginBottom={2}
                width={'100%'}
            >
                <Button
                    variant={isBulk ? 'outlined' : 'contained'}
                    color="primary"
                    onClick={() => setIsBulk(false)}
                >
                    Single Email
                </Button>
                <Button
                    variant={isBulk ? 'contained' : 'outlined'}
                    color="primary"
                    onClick={() => setIsBulk(true)}
                >
                    Bulk Email
                </Button>
            </Box>

            <FormContainer>
                <FormControlLabel
                    control={
                        <Switch
                            {...emailForm.register('useTemplate')}
                            sx={{
                                '& .MuiSwitch-switchBase': {
                                    color: theme.palette.primary.main,
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: theme.palette.primary.main,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: theme.palette.text.secondary,
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                                    {
                                        backgroundColor:
                                            theme.palette.text.secondary, // This changes the track color when the switch is checked
                                    },
                            }}
                        />
                    }
                    label="Use Template"
                    sx={{ color: 'white' }}
                />
                {isBulk ? (
                    <Box
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                        <FileDropZone />
                        <ExtractedDataTable
                            templates={templates}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                        <EmailForm
                            isBulk={isBulk}
                            templates={templates}
                            setTemplates={setTemplates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            emailForm={emailForm}
                        />
                    </Box>
                ) : (
                    <EmailForm
                        isBulk={isBulk}
                        templates={templates}
                        setTemplates={setTemplates}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                        emailForm={emailForm}
                    />
                )}
            </FormContainer>
        </Box>
    );
};

export default EmailManager;
