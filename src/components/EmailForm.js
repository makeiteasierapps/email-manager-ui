// EmailForm.js
import { Formik, Field, Form } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import axios from 'axios';

const StyledField = styled(Field)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const validationSchema = yup.object({
    sender_name: yup.string().required('Sender Name is required'),
    recipient_email: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    recipient_name: yup.string().required('Recipient Name is required'),
    recipient_company: yup.string().required('Recipient Company is required'),
    subject: yup.string().required('Subject is required'),
    message: yup.string().required('Message is required'),
});

const formFields = [
    { id: 'sender_name', label: 'Sender Name' },
    { id: 'recipient_email', label: 'Recipient Email' },
    { id: 'recipient_name', label: 'Recipient Name' },
    { id: 'recipient_company', label: 'Recipient Company' },
    { id: 'subject', label: 'Subject' },
    { id: 'message', label: 'Message', multiline: true, rows: 4 },
];

export default function EmailForm() {
    const handleSubmit = async (values, actions) => {
        let data = {
            user_id: 'shauno.co',
            sender_email: 'shaun@mg.shauno.co',
            sender_name: values.sender_name,
            recipient_email: values.recipient_email,
            recipient_name: values.recipient_name,
            recipient_company: values.recipient_company,
            subject: values.subject,
            message: values.message,
        };

        try {
            const response = await axios.post(
                'https://email-automation-api-rosy.vercel.app/send_custom',
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response);
            actions.setSubmitting(false);
        } catch (error) {
            console.error(
                'There has been a problem with your login operation:',
                error
            );
        }
    };
    return (
        <Formik
            initialValues={{
                sender_name: '',
                recipient_email: '',
                recipient_name: '',
                recipient_company: '',
                subject: '',
                message: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ errors, touched, handleChange, values }) => (
                <Form>
                    {formFields.map((field) => (
                        <StyledField
                            key={field.id}
                            as={TextField}
                            fullWidth
                            name={field.id}
                            label={field.label}
                            error={
                                touched[field.id] && Boolean(errors[field.id])
                            }
                            helperText={touched[field.id] && errors[field.id]}
                            {...(field.multiline && {
                                multiline: true,
                                rows: field.rows,
                            })}
                            onChange={handleChange}
                            value={values[field.id]}
                        />
                    ))}
                    <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        type="submit"
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
}
