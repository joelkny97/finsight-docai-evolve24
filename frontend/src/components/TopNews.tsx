import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Stack from '@mui/material/Stack';

const newsArticles = [
    {
      img: "/static/images/avatar/1.jpg",
      headline: 'Breaking News: Market Surge',
      author: 'Jane Doe',
      date: 'July 29, 2024',
      summary:
        "The stock market has experienced a significant surge today, driven by positive economic reports and investor optimism. Experts suggest this could signal a strong rebound in the market after recent downturns.",
    },
    {
      img: "/static/images/avatar/2.jpg",
      headline: 'Tech Giants Unveil New Gadgets',
      author: 'John Smith',
      date: 'July 28, 2024',
      summary:
        "Several major tech companies have unveiled their latest gadgets at the annual tech conference. Innovations in wearable technology and smart home devices are expected to be game-changers in the coming year.",
    },
    {
      img: "/static/images/avatar/3.jpg",
      headline: 'Local Community Garden Project Thrives',
      author: 'Emily Johnson',
      date: 'July 27, 2024',
      summary:
        "A community garden project in the downtown area has seen remarkable success, with locals coming together to grow their own produce. The initiative has fostered a stronger sense of community and sustainability.",
    },
    {
      img: "/static/images/avatar/4.jpg",
      headline: 'New Study Reveals Health Benefits of Meditation',
      author: 'Michael Brown',
      date: 'July 26, 2024',
      summary:
        "A new study published today highlights the extensive health benefits of meditation, including improved mental clarity, reduced stress levels, and enhanced overall well-being. Researchers advocate for integrating meditation into daily routines.",
    },
    {
      img: "/static/images/avatar/5.jpg",
      headline: 'Historic Landmark Undergoing Renovation',
      author: 'Sarah Lee',
      date: 'July 25, 2024',
      summary:
        "One of the city's historic landmarks is currently undergoing a major renovation. The project aims to restore the site to its former glory while incorporating modern amenities to enhance visitor experience.",
    },
    {
      img: "/static/images/avatar/6.jpg",
      headline: 'Local School Receives Grant for New Technology',
      author: 'David Wilson',
      date: 'July 24, 2024',
      summary:
        "A local school has been awarded a significant grant to upgrade its technology resources. The funding will support the acquisition of new computers, interactive whiteboards, and other educational tools to enhance student learning.",
    }
  ];
  

const TopNews =  () => {
    // const { news } = props;
    const theme = useTheme();
    return (

    <React.Fragment>
      <Container id="topnews" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

        <Typography variant="h4" component="h2" gutterBottom>
          Top News
        </Typography>
        <Grid container spacing={4}>
          {newsArticles.map((article: any, index: any) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea>    
                  <CardHeader
                    avatar={
                      <Avatar
                        alt={article.author}
                        src={article.img}
                        sx={{ bgcolor: theme.palette.primary.main }}
                      />
                    } 
                    title={article.headline}
                    subheader={article.date}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {article.summary}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                <CardActions sx={{ mt: 'auto' }} >
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
                    
                </CardActions>
              </Card>
            </Grid>
          ))}   
        </Grid> 
      </Container>
    </React.Fragment>
    );
  };

export default TopNews;
