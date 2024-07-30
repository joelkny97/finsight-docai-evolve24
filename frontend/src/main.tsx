import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route , BrowserRouter as Router, Routes } from 'react-router-dom'
import MyNews from './components/MyNews.tsx';

import LandingPage from './components/LandingPage.tsx';
// import './index.css'

const routing = (
  <Router>
    <React.StrictMode>
      < Routes>
        <Route path="/" element = {<LandingPage/>} />

      </Routes>
      
    </React.StrictMode>
  </Router>

);

ReactDOM.createRoot(document.getElementById('root')!).render(routing);

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )
