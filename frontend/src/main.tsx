import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route , BrowserRouter as Router, Routes } from 'react-router-dom'
import MyNews from './components/MyNews.tsx';
import AppAppBar from './components/AppAppBar.tsx';
import Footer from './components/Footer.tsx';
import Register from './components/Register.tsx';
import { PaletteMode } from '@mui/material';

import LandingPage from './components/LandingPage.tsx';
import  Login  from './components/Login.tsx';
import Logout from './components/Logout.tsx';
import Dashboard from './components/Dashboard.tsx';
import AccountVerification from './components/Authentication/AccountVerification.tsx';
import ResetPasswordForm from './components/Authentication/ResetPasswordForm.tsx';
import RequestResetPassword from './components/Authentication/RequestResetPassword.tsx';
// import './index.css'
// const [mode, setMode] = React.useState<PaletteMode>('dark');
  
// const toggleColorMode = () => {
//   setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
// };

const routing = (
  <Router>
    <React.StrictMode>
      
      < Routes>
        
        <Route path="/" element = {<LandingPage/>} />
        <Route path="/register" element = {<Register/>} />
        <Route path="/login" element = {<Login/>} />
        <Route path="/logout" element = {<Logout/>} />
        <Route path="/dashboard" element = {<Dashboard/>} />
        <Route path="/mynews" element = {<MyNews/>} />

        <Route path="/email-verify" element = {<AccountVerification/>} />

        <Route path="/request-reset-password" element={<RequestResetPassword />} />
        <Route path="/reset-password-form/:token" element={<ResetPasswordForm />} />
        
      

      </Routes>
      
      
    </React.StrictMode>
  </Router>

);

ReactDOM.createRoot(document.getElementById('root')!).render(routing);


