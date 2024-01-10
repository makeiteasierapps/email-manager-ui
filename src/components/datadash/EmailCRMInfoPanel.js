import { useEffect, useState, useContext } from 'react';
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
import { AuthContext } from '../../context/AuthContext';

const EmailCRMInfoPanel = () => {
    const [data, setData] = useState([]);
    const { uid } = useContext(AuthContext);

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/email-data?uid=${uid}`
                );
                console.log(response.data);
                setData(response.data);
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
                        <TableRow key={row.to_email}>
                            <TableCell>
                                {row.follow_up_1_sent.toString()}
                            </TableCell>
                            <TableCell>
                                {row.follow_up_2_sent.toString()}
                            </TableCell>
                            <TableCell>{row.to_company}</TableCell>
                            <TableCell>{row.to_email}</TableCell>
                            <TableCell>{row.to_name}</TableCell>
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
