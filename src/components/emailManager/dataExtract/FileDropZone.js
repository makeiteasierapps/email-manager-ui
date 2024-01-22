import { useContext } from 'react';
import { Description, Delete } from '@mui/icons-material';

import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { ManagerContext } from '../../../context/ManagerContext';

const FileDropZone = () => {
    const theme = useTheme();
    const { setFile, selectedFile, setSelectedFile } =
        useContext(ManagerContext);

    const handleFileChange = useCallback(
        (selectedFile) => {
            setFile(selectedFile);
        },
        [setFile]
    );

    const handleDelete = (event) => {
        event.stopPropagation();
        setSelectedFile(null);
        handleFileChange(null);
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (acceptedFiles[0].type !== 'text/csv') {
                alert('Please upload a .csv file');
                return;
            }
            setSelectedFile(acceptedFiles[0]);
            handleFileChange(acceptedFiles[0]);
        },
        [handleFileChange, setSelectedFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <Box
            {...getRootProps()}
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            minHeight={70}
            sx={{
                width: '30vw',
                m: 2,
                borderRadius: 1,
                textAlign: 'center',
                backgroundColor: isDragActive
                    ? '#0B666A'
                    : theme.palette.text.secondary,
            }}
        >
            <input {...getInputProps()} />

            {!selectedFile && (
                <Typography>Drop a file or click to select.</Typography>
            )}

            {selectedFile && (
                <Box display={'flex'} alignItems={'center'}>
                    <Description sx={{ fontSize: 50, color: 'primary.main' }} />
                    <Typography variant="body2">{selectedFile.name}</Typography>
                    <IconButton onClick={handleDelete}>
                        <Delete />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default FileDropZone;
