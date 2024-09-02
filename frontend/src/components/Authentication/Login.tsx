import * as React from 'react';
import axiosInstance from '../../Axios.tsx';
import { useNavigate } from "react-router-dom";

// Material UI
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import Alert from '@mui/material/Alert';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        Finsight
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {

    const navigate = useNavigate();

    const initialFormData  = Object.freeze({
      email: '',
      password: '',
      
    });

    const [formData, updateFormData] = React.useState(initialFormData);

    const [error, setError] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,

            //trimming whitespace
            [e.target.name]: e.target.value.trim(),
        });
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formData);
        // const data = new FormData(event.currentTarget);
        // console.log({
        //   email: data.get('email'),
        //   password: data.get('password'),
        // });

        axiosInstance.defaults.xsrfCookieName ='csrftoken';
        axiosInstance.defaults.xsrfHeaderName ='X-CSRFToken';

        axiosInstance
            .post(`api/token/`, {
                email: formData.email,
                password: formData.password,
            },{headers: {
                "X-CSRFToken": localStorage.getItem('csrftoken'),
            }})
            
            .then((res) => {

                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);

                axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
                navigate('/mynews');
            
                
            }
            

    )
    .catch((err) => {
        console.log(err.response);
        if (err.response.status === 401) {
            console.error(err.response.data.detail);
            setError(err.response.data.detail);
        }
        
    });

    
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {error?<Alert severity="error" sx={{ mt: 3, mb: 2 }}>{error}</Alert>:null} 
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Button href="#" component={NavLink} to='/request-reset-password'>
                  Forgot password?
                </Button>
              </Grid>
              <Grid item xs>
                <Button href="#" component={NavLink} to='/register'>
                  "Don't have an account? Sign Up"
                </Button>
              </Grid>
              
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}