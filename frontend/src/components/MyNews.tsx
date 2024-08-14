import React, { useEffect, useState } from 'react';
// import './App.css';
import NewsLoadingComponent from './NewsLoading';
import News from './News';
import getLPTheme from './getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from './AppAppBar';
import Footer from './Footer';
import { useTheme } from '@mui/system';

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100dvw',
        position: 'fixed',
        bottom: 24,
      }}
    >
      <ToggleButtonGroup
        color="primary"
        exclusive
        value={showCustomTheme}
        onChange={toggleCustomTheme}
        aria-label="Platform"
        sx={{
          backgroundColor: 'background.default',
          '& .Mui-selected': {
            pointerEvents: 'none',
          },
        }}
      >
        <ToggleButton value>
          <AutoAwesomeRoundedIcon sx={{ fontSize: '20px', mr: 1 }} />
          Custom theme
        </ToggleButton>
        <ToggleButton value={false}>Material Design 2</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}


function myNews() {
  const NewsLoading = NewsLoadingComponent(News);
  const [appState, setAppState] = useState({
    loading: false,
    news: null
  });

  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const [showCustomTheme, setShowCustomTheme] = React.useState(false);
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  // const username = "finsight-admin";
  // const password = "jetfire123";

  useEffect(() => {
    setAppState({ loading: true, news: null });
    fetch("http://127.0.0.1:8000/newsapi/", {
      headers: new Headers(
        {
          Authorization: "JWT " + localStorage.getItem("access_token"),
        }
      ),

    })
      .then(res => res.json())
      .then(data => {
        setAppState({ loading: false, news: data });
      });
    
  }, [setAppState]);

  return (
      
      <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
        <CssBaseline />
        <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
        <Divider />
        <div style={{ marginTop: '128px', marginBottom: '128px' }}>
          <NewsLoading isloading={appState.loading} news={appState.news} />
        </div>
        <Divider />

        <Footer />
        
      </ThemeProvider>
  )
  
}

export default myNews;