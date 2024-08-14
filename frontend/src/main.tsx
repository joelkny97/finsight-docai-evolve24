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
        <Route path="/mynews" element = {<MyNews/>} />
      

      </Routes>
      
      
    </React.StrictMode>
  </Router>

);

ReactDOM.createRoot(document.getElementById('root')!).render(routing);


