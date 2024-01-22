import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0F0F0F',
        },
        secondary: {
            main: '#008170',
        },
        text: {
            primary: '#fff',
            secondary: '#008170',
        },
        error: {
            main: '#ff0000',
        },
        background: {
            main: '#232D3F',
            paper: '#232D3F',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                outlined: {
                    color: '#005B41',
                    borderColor: '#005B41',
                    '&:hover': {
                        borderColor: '#008170',
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#005B41',
                        },
                        '&:hover fieldset': {
                            borderColor: '#008170',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#008170',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#008170',
                        },
                    },
                },
            },
        },
    },
});

const MyThemeProvider = ({ children }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default MyThemeProvider;
