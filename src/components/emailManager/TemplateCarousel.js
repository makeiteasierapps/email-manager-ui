import { Paper, Box, Typography } from '@mui/material';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export const createEmailTemplate = (values) => {
    const templates = [
        {
            id: 1,
            subject: `Press and Media Opportunities for ${values.to_company}`,
            content: `
                <p>
                    Hi ${values.to_name},
                </p>
                <p>
                    Thanks for connecting with us. We appreciate your brand and have been following your success!
                </p>
                <p>
                    We've helped our clients achieve amazing results, such as getting them over 500+ press features, hosting events, TV Interviews, Podcasts and gaining millions of social impressions. <a href="https://www.example.com" target="_blank">Here's a link</a> to our deck if you'd like to see some of our past work.
                </p>
                <p>
                    Are you available for a quick chat this week, or you can schedule a time on my calendar using this <a href="https://www.example.com">link</a>.
                </p>
                <p>
                    Looking forward to hearing from you!
                </p>
            `,
        },
        {
            id: 2,
            subject: `Press and Media Opportunities for ${values.to_company}`,
            content: `
                <p>
                    Hi ${values.to_name},
                </p>
                <p>
                    My name is ${values.from_name}, I am the Account Director at AmazingCo. Our team asked me to personally reach out to you and see who is the best contact on your team to discuss strategies for increasing your brand's exposure with press and media opportunities?
                </p>
                <p>
                    We have a successful track record of assisting clients in securing 500+ press features, orchestrating events, TV Interviews, Podcasts and generating millions of social impressions for them. <a href="https://www.example.com" target="_blank">Here's a link</a> to our deck showcasing some of our past work.
                </p>
                <p>
                    Are you available for a quick chat this week? Or if you could direct me to the appropriate person on your team, that would be greatly appreciated.
                </p>
                <p>
                    Thank you so much!
                </p>
            `,
        },
    ];
    return templates;
};

const TemplateCarousel = ({ templates, setSelectedTemplate }) => {
    return (
        <Paper
            elevation={3}
            style={{ backgroundColor: '#000', marginBottom: '1rem' }}
        >
            <Carousel
                showIndicators={false}
                showThumbs={false}
                onChange={(index) => setSelectedTemplate(templates[index])}
            >
                {templates.map((template) => (
                    <Box key={template.id} p={2} boxShadow={1}>
                        <Typography
                            variant="h6"
                            component="strong"
                            color="primary"
                        >
                            Subject: {template.subject}
                        </Typography>
                        <Box
                            dangerouslySetInnerHTML={{
                                __html: template.content,
                            }}
                            sx={{
                                backgroundColor: 'primary.light', // Use theme colors
                                padding: '10px',
                                borderRadius: '4px',
                                minHeight: '40vh',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        />
                    </Box>
                ))}
            </Carousel>
        </Paper>
    );
};

export default TemplateCarousel;
