import React, { useState } from 'react';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import axios from 'axios';

export default function CsvComponent() {
    const [file, setFile] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [emailTemplates, setEmailTemplates] = useState([]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

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

    return (
        <>
            <TextField
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={handleUpload}>
                Upload
            </Button>
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
                        {dataList.map((row) => (
                            <TableRow key={row.Name}>
                                <TableCell>{row.Name}</TableCell>
                                <TableCell>{row.Email}</TableCell>
                                <TableCell>{row.Company}</TableCell>
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
