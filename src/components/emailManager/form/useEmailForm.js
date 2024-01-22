import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

export const useEmailForm = () => {
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

    const useTemplate = watch('useTemplate');
    const from_name = watch('from_name');
    const subject = watch('subject');
    const message = watch('message');

    return {
        register,
        handleSubmit,
        errors,
        reset,
        formValues,
        useTemplate,
        from_name,
        subject,
        message,
    };
};
