import { useContext } from 'react';
import { Description, Delete } from '@mui/icons-material';

import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ManagerContext } from '../ManagerContext';

const FileDropZone = () => {
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
            sx={{
                width: '30vw',
                p: 2,
                m: 2,
                borderRadius: 1,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'lightgray' : 'white',
            }}
        >
            <input {...getInputProps()} />

            {!selectedFile && (
                <Typography>
                    Drag 'n' drop some files here, or click to select files
                </Typography>
            )}

            {selectedFile && (
                <Box>
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
