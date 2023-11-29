import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';

const CsvDropzone = ({ selectedFile, setSelectedFile, setFile }) => {
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
            sx={{
                border: '1px dashed gray',
                p: 2,
                m: 2,
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
                    <DescriptionIcon
                        sx={{ fontSize: 50, color: 'primary.main' }}
                    />
                    <Typography variant="body2">{selectedFile.name}</Typography>
                    <IconButton onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default CsvDropzone;
