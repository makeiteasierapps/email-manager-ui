import { useContext, useRef, useEffect } from 'react';
import { styled } from '@mui/system';
import { Button, TextField, Box } from '@mui/material';
import TemplateCarousel, { createEmailTemplate } from '../TemplateCarousel';
import { ManagerContext } from '../ManagerContext';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { RiseLoader } from 'react-spinners';
import _ from 'lodash';

const StyledField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const formFields = [
    { id: 'from_name', label: 'From' },
    { id: 'to_email', label: 'Recipient Email' },
    { id: 'to_name', label: 'Recipient Name' },
    { id: 'to_company', label: 'Company Name' },
    { id: 'subject', label: 'Subject' },
    { id: 'message', label: 'Message', multiline: true, rows: 4 },
];

const EmailForm = ({
    templates,
    setTemplates,
    selectedTemplate,
    setSelectedTemplate,
    isBulk,
    emailForm,
}) => {
    const {
        dataList,
        isSending,
        setIsSending,
        handleSendCsvEmails,
        selectedRow,
    } = useContext(ManagerContext);
    console.log(emailForm);

    const { user } = useContext(AuthContext);
    const prevFormValuesRef = useRef();

    const isFormValid =
        emailForm.from_name &&
        (emailForm.useTemplate
            ? selectedTemplate
            : emailForm.subject && emailForm.message);

    // This useEffect hook is used to store the current form values in a ref object.
    // This is done so that the previous form values can be accessed in the next render cycle.
    // The hook will run every time the formValues state changes.
    useEffect(() => {
        prevFormValuesRef.current = emailForm.formValues;
    }, [emailForm.formValues]);
    const prevFormValues = prevFormValuesRef.current;

    // This useEffect hook is used to create new email templates whenever the form values change.
    // It then updates the templates state with these new templates and sets the first template as the selected template.
    useEffect(() => {
        if (dataList.length > 0 && selectedRow) {
            const emailData = {
                to_name: selectedRow.first_name,
                to_email: selectedRow.email,
                to_company: selectedRow.company,
                from_name: emailForm.from_name,
            };
            const newTemplates = createEmailTemplate(emailData);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates[0]);
            }
        }
        if (
            emailForm.formValues &&
            !_.isEqual(emailForm.formValues, prevFormValues)
        ) {
            const newTemplates = createEmailTemplate(emailForm.formValues);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates[0]);
            }
        }
    }, [
        dataList,
        emailForm.formValues,
        emailForm.from_name,
        prevFormValues,
        selectedRow,
        setSelectedTemplate,
        setTemplates,
        templates,
    ]);

    const onSubmit = async (values) => {
        setIsSending(true);
        const emailTemplate = {
            from_email: 'test@mg.shauno.co',
            from_name: values.from_name,
            to_email: values.to_email,
            to_name: values.to_name,
            to_company: values.to_company,
            subject:
                emailForm.useTemplate && emailForm.selectedTemplate
                    ? emailForm.selectedTemplate.subject
                    : emailForm.subject,
            message:
                emailForm.useTemplate && emailForm.selectedTemplate
                    ? emailForm.selectedTemplate.content
                    : emailForm.message,
        };

        const data = {
            uid: user.uid,
            emailTemplates: emailTemplate,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/send`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status === 200) {
                alert(`Email sent successfully`);
                emailForm.reset();
            }
            setIsSending(false);
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <Box width={'100%'}>
            <form onSubmit={emailForm.handleSubmit(onSubmit)}>
                {formFields.map((field) =>
                    isBulk &&
                    ['to_email', 'to_name', 'to_company'].includes(
                        field.id
                    ) ? null : field.id === 'message' &&
                      emailForm.useTemplate ? (
                        <TemplateCarousel
                            templates={templates}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                    ) : field.id === 'subject' &&
                      emailForm.useTemplate ? null : (
                        <StyledField
                            key={field.id}
                            fullWidth
                            name={field.id}
                            label={field.label}
                            {...emailForm.register(field.id)}
                            error={!!emailForm.errors[field.id]}
                            helperText={emailForm.errors[field.id]?.message}
                            {...(field.multiline && {
                                multiline: true,
                                rows: field.rows,
                            })}
                        />
                    )
                )}
                {!isBulk ? (
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                        style={{ minHeight: '56px' }}
                        disabled={isSending}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            {isSending ? (
                                <RiseLoader color="white" />
                            ) : (
                                'Submit'
                            )}
                        </Box>
                    </Button>
                ) : (
                    isFormValid &&
                    dataList.length > 0 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                const data = {
                                    uid: user.uid,
                                    emailTemplates: dataList.map((item) => ({
                                        to_name: item.first_name,
                                        to_email: item.email,
                                        to_company: item.company,
                                        from_name: emailForm.from_name,
                                        subject:
                                            emailForm.useTemplate &&
                                            emailForm.selectedTemplate
                                                ? emailForm.selectedTemplate
                                                      .subject
                                                : emailForm.subject,
                                        message:
                                            emailForm.useTemplate &&
                                            emailForm.selectedTemplate
                                                ? emailForm.selectedTemplate
                                                      .content
                                                : emailForm.message,
                                        from_email: 'test@mg.shauno.co',
                                    })),
                                };

                                handleSendCsvEmails(data, emailForm.reset);
                            }}
                            disabled={isSending}
                        >
                            Send Emails
                        </Button>
                    )
                )}
            </form>
        </Box>
    );
};

export default EmailForm;
