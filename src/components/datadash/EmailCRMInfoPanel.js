import { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import axios from 'axios';

const EmailCRMInfoPanel = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/emaildata',
                    {
                        headers: {
                            'Auth-Key': process.env.REACT_APP_MY_AUTH_KEY,
                        },
                    }
                );
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        handleFetch();
    }, []);

    return (
        <TableContainer component={Box}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Follow Up 1 Sent</TableCell>
                        <TableCell>Follow Up 2 Sent</TableCell>
                        <TableCell>Recipient Company</TableCell>
                        <TableCell>Recipient Email</TableCell>
                        <TableCell>Recipient Name</TableCell>
                        <TableCell>Response Received</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow key={row.recipient_email}>
                            <TableCell>
                                {row.follow_up_1_sent.toString()}
                            </TableCell>
                            <TableCell>
                                {row.follow_up_2_sent.toString()}
                            </TableCell>
                            <TableCell>{row.recipient_company}</TableCell>
                            <TableCell>{row.recipient_email}</TableCell>
                            <TableCell>{row.recipient_name}</TableCell>
                            <TableCell>
                                {row.response_received.toString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EmailCRMInfoPanel;
