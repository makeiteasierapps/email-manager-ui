import { useState, useEffect, useRef, useContext } from 'react';
import _ from 'lodash';
import * as yup from 'yup';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthContext } from '../../context/AuthContext';
import { ManagerContext } from './ManagerContext';
import EmailForm from './form/EmailForm';
import CsvComponent from './dataExtract/ExtractedDataTable';
import { createEmailTemplate } from './TemplateCarousel';

const FormContainer = styled('div')({
    width: '70%',
});

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

const EmailManager = () => {
    const [isBulk, setIsBulk] = useState(false);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const { uid } = useContext(AuthContext);
    const { dataList, selectedRow } = useContext(ManagerContext);

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
        if (dataList.length > 0 && selectedRow.data) {
            const newTemplates = createEmailTemplate(selectedRow.data);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
            }
        }
        if (formValues && !_.isEqual(formValues, prevFormValues)) {
            const newTemplates = createEmailTemplate(formValues);
            if (!_.isEqual(newTemplates, templates)) {
                setTemplates(newTemplates);
                setSelectedTemplate(newTemplates[0]);
            }
        }
    }, [dataList, formValues, prevFormValues, selectedRow.data, templates]);

    const onSubmit = async (values) => {
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
            uid: uid,
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
                alert(`Email sent successfully: ${response.data}`);
                reset();
            } else {
                alert(`Failed to send email: ${response.data}`);
            }
        } catch (error) {
            console.error(
                'There has been a problem with your login operation:',
                error
            );
        }
    };

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            width={'100%'}
            height={'90vh'}
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
                            onSubmit={onSubmit}
                            handleSubmit={handleSubmit}
                            register={register}
                            watch={watch}
                            errors={errors}
                            useTemplate={useTemplate}
                            templates={templates}
                            setSelectedTemplate={setSelectedTemplate}
                            isBulk={isBulk}
                            reset={reset}
                        />
                    </>
                ) : (
                    <EmailForm
                        onSubmit={onSubmit}
                        handleSubmit={handleSubmit}
                        register={register}
                        watch={watch}
                        errors={errors}
                        useTemplate={useTemplate}
                        templates={templates}
                        setSelectedTemplate={setSelectedTemplate}
                        isBulk={isBulk}
                        reset={reset}
                    />
                )}
            </FormContainer>
        </Box>
    );
};

export default EmailManager;
