import { useState } from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import EmailForm from './form/EmailForm';
import TemplateSwitch from './form/TemplateSwitch';
import ExtractedDataTable from './dataExtract/ExtractedDataTable';
import FileDropZone from './dataExtract/FileDropZone';
import { useEmailForm } from './form/useEmailForm';

const FormContainer = styled(Box)({
    width: '70%',
});

const EmailManager = () => {
    const emailForm = useEmailForm();
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
                {isBulk ? (
                    <>
                        {' '}
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
                        </Box>
                        <TemplateSwitch emailForm={emailForm} />
                        <EmailForm
                            isBulk={isBulk}
                            templates={templates}
                            setTemplates={setTemplates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            emailForm={emailForm}
                        />
                    </>
                ) : (
                    <>
                        <TemplateSwitch emailForm={emailForm} />
                        <EmailForm
                            isBulk={isBulk}
                            templates={templates}
                            setTemplates={setTemplates}
                            selectedTemplate={selectedTemplate}
                            setSelectedTemplate={setSelectedTemplate}
                            emailForm={emailForm}
                        />
                    </>
                )}
            </FormContainer>
        </Box>
    );
};

export default EmailManager;
