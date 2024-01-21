import { useState, createContext, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [value, setValue] = useState('home');

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
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/process-file`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.status === 200) {
                setDataList(response.data.results);
                setSelectedRow({ index: 0, ...response.data.results[0] });
            }
        } catch (error) {
            console.error(error);
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
                alert('Emails sent successfully');
                setIsSending(false);
                setDataList([]);
                setSelectedFile(null);
                reset();
            }
        } catch (error) {
            console.error(error);
            alert(error.response.data);
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
            }}
        >
            {children}
        </ManagerContext.Provider>
    );
};
