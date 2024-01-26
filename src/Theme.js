import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0F0F0F',
        },
        secondary: {
            main: '#00D1B5',
        },
        text: {
            primary: '#fff',
            secondary: '#00D1B5',
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
                    color: '#00D1B5',
                    borderColor: '#005B41',
                    '&:hover': {
                        borderColor: '#00D1B5',
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
                            borderColor: '#00D1B5',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00D1B5',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#00D1B5',
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
