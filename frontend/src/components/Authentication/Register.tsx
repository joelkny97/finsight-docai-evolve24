import * as React from 'react';
import axiosInstance from '../../Axios.tsx';
import { useNavigate } from "react-router-dom";

//Material UI
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
const defaultTheme = createTheme();

// Interface for the error object
interface ErrorObject {
    [key: string]: string[]; // Each key is a field name, and the value is an array of messages
  }
  
  // Props for the ErrorMessages component
  interface ErrorMessagesProps {
    error: ErrorObject | null; // The error prop can be an ErrorObject or null
  }

const ErrorMessages: React.FC<ErrorMessagesProps> = ({ error }) => {
    if (!error || typeof error !== 'object') {
      return null;
    }
  
    // Create an array to hold all error messages
    const errorMessages: string[] = [];
  
    // Iterate over the error object and collect all messages
    Object.entries(error).forEach(([key, messages]) => {
      if (Array.isArray(messages)) {
        errorMessages.push(...messages);
      }
    });
  
    return (
      <>
        {errorMessages.map((msg, index) => (
          <Alert key={index} severity="error">
            {msg}
          </Alert>
        ))}
      </>
    );
  };
  



export default function SignUp() {
    const navigate = useNavigate();

    const [error, setError] = React.useState<ErrorObject | null>(null);


    const initialFormData  = Object.freeze({
      email: '',
      user_name: '',
      password: '',
      first_name: '',
    });

    const [formData, updateFormData] = React.useState(initialFormData);

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

        axiosInstance
            .post(`user/register/`, {
                email: formData.email,
                user_name: formData.user_name,
                first_name: formData.first_name,
                password: formData.password,
            })
            
            .then((res) => {
                navigate('/login');
                // console.log(res);
                console.log(res.data);
            
                
            }
            

    )
    .catch((err)=>{
        
        console.error(err.response.data);
        
        setError(err.response.data );
    } )
    ;

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
            Sign up
          </Typography>

          <ErrorMessages error={error} />  
        

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="user_name"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button href="#" component={NavLink} to='/login'>
                  Already have an account? Sign in
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
