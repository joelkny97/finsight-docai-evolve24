import React from 'react';
import { Container, Stack, Grid, Card, CardContent, CardMedia, Typography, Paper, ButtonBase } from '@mui/material';
import { styled } from '@mui/system';
import { ThemeProvider, createTheme, Theme } from '@mui/material/styles';
import { useTheme } from '@mui/system';
// Create a theme instance
const theme = createTheme();


// Define styled components
const StyledCard = styled(Card)(({ theme }: { theme: Theme }) => ({
    // Apply any global styles to Card here
    width: '500px',

}));

const Item = styled(Paper)(({ theme } : { theme: Theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const Img = styled('img') ({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});
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
    fontSize: '24px',
    textAlign: 'left',
    fontWeight: 'bold',
    backgroundColor: theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
    color:  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
}));

const StyledPostText = styled('div')(({ theme }: { theme: Theme }) => ({
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'baseline',
    fontSize: '12px',
    textAlign: 'left',
    marginBottom: theme.spacing(2),
    color:  theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
}));

interface NewsProps {
    news: Array<{ id: string; title: string; content: string }>;
}

const News: React.FC<NewsProps> = ({ news }) => {
    if (!news || news.length === 0) return <p>Cannot find any posts, sorry</p>;

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md" component="main">
                <Stack direction="column"  justifyContent="flex-start"  alignItems="stretch"
  spacing={2} >
                    {news.map((post) => (
                        // Enterprise card is full width at sm breakpoint
                        // <Grid item key={post.id} xs={12} md={4}>
                            <Item theme={theme}>
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <ButtonBase sx={{ width: 256, height: 256 }}>
                                            <Img src="https://picsum.photos/200" alt="Image title"/>
                                        </ButtonBase>
                                    </Grid>
                                    <Grid item container xs={12} sm>

                                        <Grid item xs container direction="column" spacing={2}>
                                            <Grid item xs>
                                                <StyledCardContent theme={theme}>
                                                    <StyledPostTitle  theme ={theme} gutterBottom variant="h6">
                                                        {post.title.substr(0, 100)}
                                                    </StyledPostTitle>
                                                    <StyledPostText theme={theme}>
                                                        <Typography component="p" color="textPrimary">
                                                            {/* You can add more content here if needed */}
                                                        </Typography>
                                                        <Typography component="p" color="textSecondary">
                                                            {post.content.substr(0, 100)}...
                                                        </Typography>
                                                    </StyledPostText>
                                                </StyledCardContent>
                                            </Grid>

                                    </Grid>
                                    
                                    

                                </Grid>
                            </Grid>
        
                                
                                
                            </Item>
                        // </Grid>
                    ))}
                </Stack>
            </Container>
        </ThemeProvider>
    );
};

export default News;
