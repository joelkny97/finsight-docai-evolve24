import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../Axios';


const EmailVerification = () => {
  const history = useNavigate();
  const location = useLocation();

  axiosInstance.defaults.xsrfCookieName ='csrftoken';
  axiosInstance.defaults.xsrfHeaderName ='X-CSRFToken';


  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    const verifyEmail = async () => {
      try {
        const response = await axiosInstance.get('/user/email-verify/', {
          params: { token },
        });

        console.log('Email verified successfully!', response.data);

        // Redirect the user to a success page or perform other actions
        alert('Email verified successfully!');
        history('/login');
      } catch (error) {
        console.error('Failed to verify email:', error);

        // Redirect the user to an error page or perform other actions
        alert('Email not verified!');
        history('/register');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      console.error('Email verification token not found!');
      history('/verification-error');
    }
  }, [history, location.search]);

  return null; // or display a loading spinner
};

export default EmailVerification;
