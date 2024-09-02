import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Axios.tsx';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
	const history = useNavigate();

	useEffect(() => {

		axiosInstance.defaults.xsrfCookieName ='csrftoken';
        axiosInstance.defaults.xsrfHeaderName ='X-CSRFToken';
		
		const response = axiosInstance.post('user/logout/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
			
		},{headers: {
			"X-CSRFToken": localStorage.getItem('csrftoken'),
		}});

		

		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		axiosInstance.defaults.headers['Authorization'] = null;
		history('/login');
	});
	return <div>Logout</div>;
} 