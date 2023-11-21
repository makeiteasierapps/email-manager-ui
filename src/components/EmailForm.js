import { useState, useEffect } from 'react';
import { Formik, Field, Form, useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const StyledField = styled(Field)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

function createEmailTemplate(values) {
    const templates = [
        {
            id: 1,
            content: `
                <h1> ${values.recipient_company} x Gal Media</h1>
                <p>
                    Hi ${values.recipient_name},
                </p>
                <p>
                    Thanks for connecting with us on Instagram [or wherever you found them]. We love your brand and have been following your success!
                </p>
                <p>
                    We've helped our clients achieve amazing results, such as getting them over 500+ press features, hosting Instagram-worthy events, TV Interviews, Podcasts and gaining millions of social impressions. <a href="your_deck_link_here">Here's a link</a> to our deck if you'd like to see some of our past work.
                </p>
                <p>
                    We use a simple 4-step system to help our clients achieve their PR goals and rank higher on google, and I'd love to schedule a quick 20-minute call with you to discuss how we can implement this process to help take your brand to new heights.
                </p>
                <p>
                    Are you available for a quick chat this week, or you can schedule a time on my calendar using this <a href="https://calendly.com/galmediagroup/consultation">link</a>.
                </p>
                <p>
                    Looking forward to hearing from you!
                </p>
            `,
        },
        {
            id: 2,
            content: `
                <h1>Press and Media Opportunities for ${values.recipient_company}</h1>
                <p>
                    Hi ${values.recipient_name},
                </p>
                <p>
                    My name is ${values.sender_name}, I am the Senior Account Director at Gal Media. Our Founder, Jennifer Jaden, asked me to personally reach out to you and see who is the best contact on your team to discuss strategies for increasing your brand's exposure with press and media opportunities?
                </p>
                <p>
                    We have a successful track record of assisting clients in securing 500+ press features, orchestrating Instagram-worthy events, TV Interviews, Podcasts and generating millions of social impressions for them. <a href="your_deck_link_here">Here's a link</a> to our deck showcasing some of our past work.
                </p>
                <p>
                    Are you available for a quick chat this week? Or if you could direct me to the appropriate person on your team, that would be greatly appreciated.
                </p>
                <p>
                    Thank you so much!
                </p>
            `,
        },
    ];
    return templates;
}

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
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [templates, setTemplates] = useState([]);
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
    
    const formik = useFormik({
        initialValues: {
            useTemplate: false,
            sender_name: '',
            recipient_email: '',
            recipient_name: '',
            recipient_company: '',
            subject: '',
            message: '',
        },
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
    });

    useEffect(() => {
        const templates = createEmailTemplate(formik.values);
        setTemplates(templates);
    }, [formik.values]);

    return (
        <>
            <Formik {...formik}>
                {({ errors, touched, handleChange, values }) => {
                    return (
                        <Form>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={values.useTemplate}
                                        onChange={handleChange}
                                        name="useTemplate"
                                        color="primary"
                                    />
                                }
                                label="Use Template"
                            />
                            {formFields.map((field) =>
                                field.id === 'message' && values.useTemplate ? (
                                    <Carousel>
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                onClick={() =>
                                                    setPreviewTemplate(template)
                                                }
                                            >
                                                <Card>
                                                    <CardContent>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: template.content,
                                                            }}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <StyledField
                                        key={field.id}
                                        as={TextField}
                                        fullWidth
                                        name={field.id}
                                        label={field.label}
                                        error={
                                            touched[field.id] &&
                                            Boolean(errors[field.id])
                                        }
                                        helperText={
                                            touched[field.id] &&
                                            errors[field.id]
                                        }
                                        {...(field.multiline && {
                                            multiline: true,
                                            rows: field.rows,
                                        })}
                                        onChange={handleChange}
                                        value={values[field.id]}
                                    />
                                )
                            )}
                            <Button
                                color="primary"
                                variant="contained"
                                fullWidth
                                type="submit"
                            >
                                Submit
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
            <Dialog
                open={!!previewTemplate}
                onClose={() => setPreviewTemplate(null)}
            >
                <DialogContent>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: previewTemplate?.content,
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
}
