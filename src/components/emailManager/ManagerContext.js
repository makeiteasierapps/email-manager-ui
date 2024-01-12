import { useState, createContext } from 'react';
import axios from 'axios';

export const ManagerContext = createContext();

export const ManagerProvider = ({ children }) => {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);

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
                setSelectedRow({index: 0, ...response.data.results[0]});
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
            } else {
                alert('Failed to send emails');
            }
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
                selectedRow,
                setSelectedRow,
            }}
        >
            {children}
        </ManagerContext.Provider>
    );
};
