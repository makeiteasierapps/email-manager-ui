import { useContext } from 'react';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    useTheme,
} from '@mui/material';

import { ManagerContext } from '../ManagerContext';

const ExtractedDataTable = () => {
    const theme = useTheme();
    const { dataList, handleUpload, selectedRow, setSelectedRow } =
        useContext(ManagerContext);

    return (
        <>
            <Box display={'flex'} justifyContent={'center'} gap>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                >
                    Extract Data
                </Button>
            </Box>
            <Box
                display={'flex'}
                justifyContent={'center'}
                margin={4}
                width={'100%'}
            >
                <TableContainer
                    component={Paper}
                    elevation={6}
                    style={{ maxHeight: 440, minHeight: 200 }}
                >
                    <Table aria-label="simple table">
                        <TableHead
                            sx={{
                                borderBottom: `2px solid ${theme.palette.text.secondary}`,
                            }}
                        >
                            <TableRow>
                                <TableCell
                                    align={'center'}
                                    sx={{
                                        width: '150px',
                                    }}
                                >
                                    Name
                                </TableCell>
                                <TableCell
                                    align={'center'}
                                    sx={{ width: '150px' }}
                                >
                                    Email
                                </TableCell>
                                <TableCell
                                    align={'center'}
                                    sx={{ width: '150px' }}
                                >
                                    Company
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataList.map((row, index) => (
                                <TableRow
                                    key={index}
                                    onClick={() => {
                                        setSelectedRow({
                                            index,
                                            ...row,
                                        });
                                    }}
                                    style={
                                        selectedRow.index === index
                                            ? {
                                                  backgroundColor: '#0B666A',
                                                  borderBottom: `2px solid ${theme.palette.text.secondary}`,
                                              }
                                            : {
                                                  borderBottom: `2px solid ${theme.palette.text.secondary}`,
                                              }
                                    }
                                >
                                    <TableCell align={'center'}>
                                        {row.first_name}
                                    </TableCell>
                                    <TableCell align={'center'}>
                                        {row.email}
                                    </TableCell>
                                    <TableCell align={'center'}>
                                        {row.company}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default ExtractedDataTable;
