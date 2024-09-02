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

const messageBanner = ({ text }: { text: string } ) => {
  return (
    <Box sx={{ backgroundColor: '#69c9ab', color: '#ffffff', width: '90%', height: '40px', position: 'absolute', top: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '5px'}}>
      {text}
    </Box>
  );
}


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

export default function RequestResetPassword() {

    const navigate = useNavigate();

    const initialFormData  = Object.freeze({
      email: '',
      
    });

    const [formData, updateFormData] = React.useState(initialFormData);

    const [error, setError] = React.useState('');

    const [showMessage, setShowMessage] = React.useState(false);

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
            .post(`user/password_reset/`, {
                email: formData.email,
            },{headers: {
                "X-CSRFToken": localStorage.getItem('csrftoken'),
            }})
            
            .then((res) => {
                console.log(res);
                setShowMessage(true);

                // localStorage.setItem('access_token', res.data.access);
                // localStorage.setItem('refresh_token', res.data.refresh);

                // axiosInstance.defaults.headers['Authorization'] = 'JWT ' + localStorage.getItem('access_token');
                navigate('/login');
            
                
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
        {showMessage ? messageBanner({ text: 'Password reset link sent. Please check your email.' }) : null}
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
            Reset Password
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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Password Reset Link
            </Button>
            
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}