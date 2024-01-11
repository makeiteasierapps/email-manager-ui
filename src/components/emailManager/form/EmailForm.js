import { useContext } from 'react';
import { styled } from '@mui/system';
import { TextField, Button, Card, CardContent } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ManagerContext } from '../ManagerContext';
import { AuthContext } from '../../../context/AuthContext';

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

const TemplateCarousel = ({ templates, setSelectedTemplate }) => {
    return (
        <Carousel
            showThumbs={false}
            onChange={(index) => setSelectedTemplate(templates[index])}
        >
            {templates.map((template) => (
                <div key={template.id}>
                    <Card>
                        <CardContent>
                            <div>
                                <strong>Subject:</strong> {template.subject}
                            </div>
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
    );
};

const EmailForm = ({
    onSubmit,
    handleSubmit,
    register,
    watch,
    errors,
    useTemplate,
    templates,
    setSelectedTemplate,
    isBulk,
    reset,
}) => {
    const { dataList, isSending, handleSendCsvEmails } =
        useContext(ManagerContext);
    const { uid } = useContext(AuthContext);
    const from_name = watch('from_name');
    const subject = watch('subject');
    const message = watch('message');

    const isFormValid = from_name && subject && message;

    const data = {
        uid: uid,
        emailTemplates: dataList.map((item) => ({
            to_name: item.first_name,
            to_email: item.email,
            to_company: item.company,
            from_name,
            subject,
            message,
            from_email: 'test@mg.shauno.co',
        })),
    };

    return (
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
                >
                    Submit
                </Button>
            ) : (
                isFormValid &&
                dataList.length > 0 && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleSendCsvEmails(data, reset);
                        }}
                        disabled={isSending}
                    >
                        Send Emails
                    </Button>
                )
            )}
        </form>
    );
};

export default EmailForm;
