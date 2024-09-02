import * as React from 'react';
import axiosInstance from '../../Axios.tsx';
import { useNavigate, useParams } from "react-router-dom";

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

export default function ResetPasswordForm() {

    const navigate = useNavigate();

    const initialFormData  = Object.freeze({
      password: '',
      password2: '',
      
    });

    const [formData, updateFormData] = React.useState(initialFormData);

    const [error, setError] = React.useState('');

    const [showMessage, setShowMessage] = React.useState(false);

    const {token} = useParams();

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
        
        if (formData.password !== formData.password2) {
            setError('Passwords do not match');
            return;
        }
        // const data = new FormData(event.currentTarget);
        // console.log({
        //   email: data.get('email'),
        //   password: data.get('password'),
        // });

        axiosInstance.defaults.xsrfCookieName ='csrftoken';
        axiosInstance.defaults.xsrfHeaderName ='X-CSRFToken';

        axiosInstance
            .post(`user/password_reset/confirm/`, {
                password: formData.password,
                token: token,
            },{headers: {
                "X-CSRFToken": localStorage.getItem('csrftoken'),
            }})
            
            .then((res) => {
                console.log(res);

                setShowMessage(true);

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            
                
            }
            

    )
    .catch((err) => {
        console.log(err.response);
        setError(err.response.data.password);
        
    });

    
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {showMessage ? <Alert severity="success" sx={{ mt: 3, mb: 2 }}>Password reset successfully. Redirecting to login.</Alert> : null}
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
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              autoComplete="current-password"
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Reset Password
            </Button>
            
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}