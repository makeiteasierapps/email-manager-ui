import { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const { uid } = useContext(AuthContext);

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
            setDataList(response.data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendCsvEmails = async () => {
        setIsSending(true);
        const data = { user_id: uid, emailTemplates };
        try {
            await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/send`,
                data,
                {
                    headers: {
                        'Auth-Key': process.env.REACT_APP_MY_AUTH_KEY,
                    },
                }
            );
            alert('Emails sent successfully');
            setIsSending(false);
            setEmailTemplates([]);
            setDataList([]);
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            alert('Failed to send emails');
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
            }}
        >
            {children}
        </ManagerContext.Provider>
    );
};
