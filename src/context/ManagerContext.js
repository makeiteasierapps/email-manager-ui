import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [value, setValue] = useState('home');

    // Snackbar state
    const [snackbarInfo, setSnackbarInfo] = useState({
        open: false,
        message: '',
        severity: 'info',
    });

    // Function to show snackbar
    const showSnackbar = (message, severity) => {
        setSnackbarInfo({ open: true, message, severity });
    };

    // Function to hide snackbar
    const hideSnackbar = () => {
        setSnackbarInfo({ ...snackbarInfo, open: false });
    };

    const { user, setUser } = useContext(AuthContext);

    useEffect(() => {
        if (localStorage.getItem('location')) {
            setValue(localStorage.getItem('location'));
        } else {
            setValue('home');
        }
    }, []);

    const handleUseTrial = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/start-trial`,
                {
                    uid: user.uid,
                    onTrial: true,
                }
            );
            const { mailgunApiKey, mailgunDomain } = response.data;

            const updatedUser = {
                ...user,
                onTrial: true,
                mailgunApiKey,
                mailgunDomain,
            };

            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (error) {
            console.error(error);
        }
    };

    // Handles extracting data from the CSV file
    const handleUpload = async () => {
        if (!file) {
            showSnackbar('Please select a file first', 'warning');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file...', file)

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/process-file`,
                formData
            );
            if (response.status === 200) {
                setDataList(response.data.results);
                setSelectedRow({ index: 0, ...response.data.results[0] });
                showSnackbar('File processed successfully', 'success');
            }
        } catch (error) {
            console.error(error);
            let errorMessage = 'Failed to process file';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    const handleSendCsvEmails = async (emailData, reset) => {
        setIsSending(true);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/send`,
                emailData,
                {
                    headers: {
                        'Auth-Key': process.env.REACT_APP_MY_AUTH_KEY,
                    },
                }
            );
            if (response.status === 200) {
                showSnackbar('Emails sent successfully', 'success');
                setIsSending(false);
                setDataList([]);
                setSelectedFile(null);
                reset();
            }
        } catch (error) {
            console.error(error);
            let errorMessage = 'An error occurred';
            if (error.response && error.response.data) {
                errorMessage = error.response.data;
            } else if (error.message) {
                errorMessage = error.message;
            }
            showSnackbar(errorMessage, 'error');
        }
    };

    return (
        <ManagerContext.Provider
            value={{
                setFile,
                handleUpload,
                dataList,
                handleSendCsvEmails,
                selectedFile,
                setSelectedFile,
                isSending,
                setIsSending,
                selectedRow,
                setSelectedRow,
                handleUseTrial,
                value,
                setValue,
                snackbarInfo,
                showSnackbar,
                hideSnackbar,
            }}
        >
            {children}
        </ManagerContext.Provider>
    );
};
