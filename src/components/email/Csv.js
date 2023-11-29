import { useState } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import axios from 'axios';
import CsvDropzone from './FileDropZone';
export default function CsvComponent() {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [emailTemplates, setEmailTemplates] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                'http://localhost:5000/upload',
                formData
            );

            setDataList(response.data.data_list);
            setEmailTemplates(response.data.email_templates);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSendCsvEmails = async () => {
        setIsSending(true);
        const data = { user_id: 'shauno.co', email_templates: emailTemplates };
        try {
            await axios.post('http://localhost:5000/send_multiple', data);
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
        <>
            <CsvDropzone
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                setFile={setFile}
            />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
            {emailTemplates.length > 0 && dataList.length > 0 && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendCsvEmails}
                    disabled={isSending}
                >
                    Send Emails
                </Button>
            )}
            <TableContainer component={Paper} style={{ maxHeight: 440 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Company</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataList.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.first_name}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.company}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer
                component={Paper}
                style={{ maxHeight: 440, marginTop: '20px' }}
            >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Message</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {emailTemplates.map((template, index) => (
                            <TableRow key={index}>
                                <TableCell>{template.email}</TableCell>
                                <TableCell>{template.subject}</TableCell>
                                <TableCell>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: template.message,
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
