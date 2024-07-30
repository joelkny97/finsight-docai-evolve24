import React from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';

// Create a theme instance
const theme = createTheme();

// Define styled components
const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
    // Apply any global styles to Card here
}));

const StyledCardMedia = styled(CardMedia)(({ theme }: { theme: Theme }) => ({
    paddingTop: '56.25%', // 16:9
}));

const StyledCardContent = styled(CardContent)(({ theme }: { theme: Theme }) => ({
    // Apply styles to CardContent if needed
}));

const StyledCardHeader = styled('div')(({ theme }: { theme: Theme }) => ({
    backgroundColor:
        theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[700],
}));

const StyledPostTitle = styled(Typography)(({ theme }: { theme: Theme }) => ({
    fontSize: '16px',
    textAlign: 'left',
}));

const StyledPostText = styled('div')(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'baseline',
    fontSize: '12px',
    textAlign: 'left',
    marginBottom: theme.spacing(2),
}));

interface NewsProps {
    news: Array<{ id: string; title: string; headline: string }>;
}

const News: React.FC<NewsProps> = ({ news }) => {
    if (!news || news.length === 0) return <p>Cannot find any posts, sorry</p>;

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" component="main">
                <Grid container spacing={5} alignItems="flex-end">
                    {news.map((post) => (
                        // Enterprise card is full width at sm breakpoint
                        <Grid item key={post.id} xs={12} md={4}>
                            <StyledCard theme={theme}>
                                {/* Uncomment and update if using CardMedia */}
                                {/* <StyledCardMedia
                                    image="https://source.unsplash.com/random"
                                    title="Image title"
                                /> */}
                                <StyledCardContent theme={theme}>
                                    <StyledPostTitle  theme ={theme} gutterBottom variant="h6">
                                        {post.title.substr(0, 50)}...
                                    </StyledPostTitle>
                                    <StyledPostText theme={theme}>
                                        <Typography component="p" color="textPrimary">
                                            {/* You can add more content here if needed */}
                                        </Typography>
                                        <Typography component="p" color="textSecondary">
                                            {post.headline.substr(0, 60)}...
                                        </Typography>
                                    </StyledPostText>
                                </StyledCardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default News;
