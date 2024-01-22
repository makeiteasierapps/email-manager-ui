import React from 'react';
import { Switch, FormControlLabel, useTheme } from '@mui/material';

const TemplateSwitch = ({ emailForm }) => {
    const theme = useTheme();

    return (
        <FormControlLabel
            control={
                <Switch
                    {...emailForm.register('useTemplate')}
                    sx={{
                        '& .MuiSwitch-switchBase': {
                            color: theme.palette.primary.main,
                        },
                        '& .MuiSwitch-track': {
                            backgroundColor: theme.palette.primary.main,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: theme.palette.text.secondary,
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                            {
                                backgroundColor: theme.palette.text.secondary,
                            },
                    }}
                />
            }
            label="Use Template"
            sx={{ color: 'white' }}
        />
    );
};

export default TemplateSwitch;
