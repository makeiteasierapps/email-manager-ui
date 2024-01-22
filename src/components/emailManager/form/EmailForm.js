import { useContext, useRef, useEffect } from 'react';
import { styled } from '@mui/system';
import {
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Box,
} from '@mui/material';
import TemplateCarousel, { createEmailTemplate } from '../TemplateCarousel';
import { ManagerContext } from '../ManagerContext';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
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

const validationSchema = yup.object({
    from_name: yup.string().required('Sender Name is required'),
    to_email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    to_name: yup.string().required('Recipient Name is required'),
    to_company: yup.string().required('Recipient Company is required'),
    subject: yup
        .string()
        .test('useTemplate', 'Subject is required', function (value) {
            const { useTemplate } = this.parent;
            return useTemplate ? true : !!value;
        }),
    message: yup
        .string()
        .test('useTemplate', 'Message is required', function (value) {
            const { useTemplate } = this.parent;
            return useTemplate ? true : !!value;
        }),
});

const EmailForm = ({
    templates,
    setTemplates,
    selectedTemplate,
    setSelectedTemplate,
    isBulk,
}) => {
    const {
        dataList,
        isSending,
        setIsSending,
        handleSendCsvEmails,
        selectedRow,
    } = useContext(ManagerContext);

    const { user } = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const formValues = watch();
    const prevFormValuesRef = useRef();
    const useTemplate = watch('useTemplate');
    const from_name = watch('from_name');
    const subject = watch('subject');
    const message = watch('message');
    const isFormValid =
        from_name && (useTemplate ? selectedTemplate : subject && message);

    // This useEffect hook is used to store the current form values in a ref object.
    // This is done so that the previous form values can be accessed in the next render cycle.
    // The hook will run every time the formValues state changes.
    useEffect(() => {
        prevFormValuesRef.current = formValues;
    }, [formValues]);
    const prevFormValues = prevFormValuesRef.current;

    // This useEffect hook is used to create new email templates whenever the form values change.
    // It then updates the templates state with these new templates and sets the first template as the selected template.
    useEffect(() => {
        if (dataList.length > 0 && selectedRow) {
            const emailData = {
                to_name: selectedRow.first_name,
                to_email: selectedRow.email,
                to_company: selectedRow.company,
                from_name,
            };
            const newTemplates = createEmailTemplate(emailData);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates[0]);
            }
        }
        if (formValues && !_.isEqual(formValues, prevFormValues)) {
            const newTemplates = createEmailTemplate(formValues);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates[0]);
            }
        }
    }, [
        dataList,
        formValues,
        from_name,
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
                useTemplate && selectedTemplate
                    ? selectedTemplate.subject
                    : values.subject,
            message:
                useTemplate && selectedTemplate
                    ? selectedTemplate.content
                    : values.message,
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
                reset();
            }
            setIsSending(false);
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <>
            <FormControlLabel
                control={
                    <Switch {...register('useTemplate')} color="primary" />
                }
                label="Use Template"
            />
            <form onSubmit={handleSubmit(onSubmit)}>
                {formFields.map((field) =>
                    isBulk &&
                    ['to_email', 'to_name', 'to_company'].includes(
                        field.id
                    ) ? null : field.id === 'message' && useTemplate ? (
                        <TemplateCarousel
                            templates={templates}
                            setSelectedTemplate={setSelectedTemplate}
                        />
                    ) : field.id === 'subject' && useTemplate ? null : (
                        <StyledField
                            key={field.id}
                            fullWidth
                            name={field.id}
                            label={field.label}
                            {...register(field.id)}
                            error={!!errors[field.id]}
                            helperText={errors[field.id]?.message}
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
                                        from_name,
                                        subject:
                                            useTemplate && selectedTemplate
                                                ? selectedTemplate.subject
                                                : subject,
                                        message:
                                            useTemplate && selectedTemplate
                                                ? selectedTemplate.content
                                                : message,
                                        from_email: 'test@mg.shauno.co',
                                    })),
                                };

                                handleSendCsvEmails(data, reset);
                            }}
                            disabled={isSending}
                        >
                            Send Emails
                        </Button>
                    )
                )}
            </form>
        </>
    );
};

export default EmailForm;
