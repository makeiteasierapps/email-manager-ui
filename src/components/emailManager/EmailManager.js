import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import EmailForm from './form/EmailForm';
import CsvComponent from './dataExtract/ExtractedDataTable';

const FormContainer = styled(Box)({
    width: '70%',
});

const EmailManager = () => {
    const [isBulk, setIsBulk] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            width={'100%'}
            height={'100vh'}
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
                {isBulk ? (
                    <>
                        <CsvComponent
                            templates={templates}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                        <EmailForm
                            isBulk={isBulk}
                            templates={templates}
                            setTemplates={setTemplates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                    </>
                ) : (
                    <EmailForm
                        isBulk={isBulk}
                        templates={templates}
                        setTemplates={setTemplates}
                        selectedTemplate={selectedTemplate}
                        setSelectedTemplate={setSelectedTemplate}
                    />
                )}
            </FormContainer>
        </Box>
    );
};

export default EmailManager;
