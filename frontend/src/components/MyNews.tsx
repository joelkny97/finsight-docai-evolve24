import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Axios';
import NewsLoadingComponent from './NewsLoading';
import StockSearchBar from './StockSearch';
import News from './News';
import getLPTheme from './getLPTheme';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import AppAppBar from './AppAppBar';
import Footer from './Footer';
import Box from '@mui/material/Box';

interface ToggleCustomThemeProps {
  showCustomTheme: boolean;
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

function MyNews() {
  const NewsLoading = NewsLoadingComponent(News);
  const [appState, setAppState] = useState({
    loading: false,
    news: null,
  });

  const navigate = useNavigate();

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

  const fetchNews = (query: string | null) => {
    setAppState({ loading: true, news: null });
    axiosInstance.defaults.headers['Authorization'] = `JWT ${localStorage.getItem('access_token')}`;

    const apiEndpoint = 'http://127.0.0.1:8000/api/news/';
    const requestConfig = query
      ? { method: 'POST', data: { title: query, content: "test" } }
      : { method: 'GET' };

    axiosInstance(apiEndpoint, requestConfig)
      .then((data) => {
        setAppState({ loading: false, news: data.data });
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/login');
        } else {
          setAppState({ loading: false, news: null });
        }
      });
  };

  // Call fetchNews when the component mounts
  useEffect(() => {
    fetchNews(null); // Fetch existing news on mount
  }, []);

  // Handle query input from StockSearchBar
  const handleSearchSubmit = (query: string) => {
    fetchNews(query);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Divider />
      <StockSearchBar onSearchSubmit={handleSearchSubmit} />
      <Divider />

      <div style={{ marginTop: '128px', marginBottom: '128px' }}>
        <NewsLoading isLoading={appState.loading} news={appState.news} />
      </div>
      <Divider />

      <Footer />
    </ThemeProvider>
  );
}

export default MyNews;
