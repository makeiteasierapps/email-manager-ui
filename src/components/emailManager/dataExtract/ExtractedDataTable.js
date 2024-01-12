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
} from '@mui/material';
import FileDropZone from './FileDropZone';
import { ManagerContext } from '../ManagerContext';

const ExtractedDataTable = () => {
    const { dataList, handleUpload, selectedRow, setSelectedRow } =
        useContext(ManagerContext);

    return (
        <>
            <FileDropZone />
            <Box display={'flex'} justifyContent={'center'} margin={4} gap>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                >
                    Extract Data
                </Button>
            </Box>
            <Box display={'flex'} justifyContent={'center'} margin={4} gap={2}>
                <TableContainer component={Paper} style={{ maxHeight: 440 }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align={'center'}>Name</TableCell>
                                <TableCell align={'center'}>Email</TableCell>
                                <TableCell align={'center'}>Company</TableCell>
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
                                            ? { backgroundColor: 'lightgray' }
                                            : {}
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
