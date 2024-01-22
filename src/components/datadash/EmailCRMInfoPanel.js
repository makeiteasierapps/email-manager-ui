import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Paper,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ManagerContext } from '../../context/ManagerContext';
import { ExpandMore } from '@mui/icons-material';
import { PuffLoader } from 'react-spinners/';
import MySnackBar from '../SnackBar';

const EmailCRMInfoPanel = () => {
    const [data, setData] = useState([]);
    const [expandedRow, setExpandedRow] = useState(null);
    const [loading, setLoading] = useState(false);
    const { showSnackbar, snackbarInfo, hideSnackbar } =
        useContext(ManagerContext);
    const { user } = useContext(AuthContext);
    const theme = useTheme();

    useEffect(() => {
        const handleFetch = async () => {
            if (user) {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BACKEND_URL}/email-data?uid=${user.uid}`
                    );

                    setData(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error(error);
                    let errorMessage = 'Failed to fetch email data';
                    if (error.response && error.response.data) {
                        errorMessage = error.response.data;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                    showSnackbar(errorMessage, 'error');
                }
                setLoading(false);
            }
        };
        handleFetch();
    }, [showSnackbar, user]);

    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            width={'80vw'}
            alignItems={'center'}
            justifyContent={'space-around'}
            height={'60vh'}
        >
            <Typography
                fontSize={{ xs: '2.5rem', sm: '3rem', md: '4.5rem' }}
                fontFamily={'Grape Nuts'}
                fontWeight={'bold'}
                color={theme.palette.text.secondary}
            >
                DataDash
            </Typography>
            <TableContainer
                component={Paper}
                elevation={9}
                sx={{ minHeight: '50vh' }}
            >
                <Table>
                    <TableHead
                        sx={{
                            borderBottom: `2px solid ${theme.palette.text.secondary}`,
                        }}
                    >
                        <TableRow>
                            <TableCell align={'center'} sx={{ width: '150px' }}>
                                Follow Ups sent
                            </TableCell>
                            <TableCell align={'center'} sx={{ width: '150px' }}>
                                Company
                            </TableCell>
                            <TableCell align={'center'} sx={{ width: '150px' }}>
                                Email
                            </TableCell>
                            <TableCell align={'center'} sx={{ width: '150px' }}>
                                Name
                            </TableCell>
                            <TableCell align={'center'} sx={{ width: '150px' }}>
                                Received
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {data.length === 0 ? (
                        <TableBody>
                            <TableRow>
                                <TableCell
                                    align="center"
                                    colSpan={5}
                                    sx={{
                                        height: '50vh',
                                        borderBottom: 0,
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection={'column'}
                                    >
                                        {loading ? (
                                            <>
                                                <PuffLoader
                                                    color={
                                                        theme.palette.text
                                                            .secondary
                                                    }
                                                    size={100}
                                                />
                                                <Typography
                                                    variant="subtitle1"
                                                    align="center"
                                                    color="textSecondary"
                                                >
                                                    Your data will be displayed
                                                    here.
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography
                                                variant="subtitle1"
                                                align="center"
                                                color="textSecondary"
                                            >
                                                Your data will be displayed
                                                here.
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    ) : (
                        <TableBody>
                            {data.map((row, index) => (
                                <React.Fragment key={row.to_email}>
                                    <TableRow
                                        style={{
                                            borderBottom: `2px solid ${theme.palette.text.secondary}`,
                                        }}
                                    >
                                        <TableCell align={'center'}>
                                            {
                                                [
                                                    row.follow_up_1_sent,
                                                    row.follow_up_2_sent,
                                                ].filter(Boolean).length
                                            }
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {row.to_company}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {row.to_email}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {row.to_name}
                                        </TableCell>
                                        <TableCell align={'center'}>
                                            {row.response_received ? (
                                                <IconButton
                                                    onClick={() =>
                                                        setExpandedRow(
                                                            expandedRow ===
                                                                index
                                                                ? null
                                                                : index
                                                        )
                                                    }
                                                >
                                                    <ExpandMore
                                                        color={'secondary'}
                                                    />
                                                </IconButton>
                                            ) : (
                                                'No Response'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === index && (
                                        <TableRow>
                                            <TableCell colSpan={5}>
                                                <Accordion
                                                    expanded={
                                                        expandedRow === index
                                                    }
                                                >
                                                    <AccordionSummary
                                                        aria-controls={`panel${index}a-content`}
                                                        id={`panel${index}a-header`}
                                                    >
                                                        <Typography
                                                            color={'secondary'}
                                                            fontSize={{
                                                                xs: '1.5rem',
                                                                sm: '2rem',
                                                                md: '3rem',
                                                            }}
                                                            fontFamily={
                                                                'Grape Nuts'
                                                            }
                                                        >
                                                            Email Echange
                                                        </Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Typography
                                                            component={'span'}
                                                        >
                                                            <ul>
                                                                {row.email.map(
                                                                    (
                                                                        emailObj,
                                                                        index
                                                                    ) => (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            {JSON.stringify(
                                                                                emailObj
                                                                            )}
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        </Typography>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableBody>
                    )}
                </Table>
            </TableContainer>
            <MySnackBar
                open={snackbarInfo.open}
                message={snackbarInfo.message}
                severity={snackbarInfo.severity}
                handleClose={hideSnackbar}
            />
        </Box>
    );
};

export default EmailCRMInfoPanel;
