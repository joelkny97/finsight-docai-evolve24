import * as React from 'react';
import { PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode';
import Logo from '../assets/jk-nav-site-logo.png';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';


const logoStyle = {
  width: '30px',
  height: 'auto',
  cursor: 'pointer',
};

interface AppAppBarProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function loggedIn(){
    if (localStorage.getItem('access_token') != null) {
        return true;
    } else {
        return false;
    }
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
  const [open, setOpen] = React.useState(false);

  

  const loggedInState = loggedIn();
  console.log(loggedInState);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    const offset = 128;
    if (sectionElement) {
      const targetScroll = sectionElement.offsetTop - offset;
      sectionElement.scrollIntoView({ behavior: 'smooth' });
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
      setOpen(false);
    }
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: 'transparent',
          backgroundImage: 'none',
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            variant="regular"
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              borderRadius: '999px',
              bgcolor:
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.4)'
                  : 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(24px)',
              maxHeight: 40,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow:
                theme.palette.mode === 'light'
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
            })}
          >
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                ml: '-18px',
                px: 0,
              }}
            >
              <img 
                src={
                  Logo
                }
                style={logoStyle}
                alt="logo of FinSight"
                
              />
              { !loggedInState &&
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <MenuItem
                  onClick={() => scrollToSection('topnews')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Top News
                  </Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => scrollToSection('features')}
                  sx={{ py: '6px', px: '12px' }}
                >
                  <Typography variant="body2" color="text.primary">
                    Features
                  </Typography>
                </MenuItem>
                
                

              </Box>}

              { loggedInState &&
                <Box sx={{ display: { xs: 'none', md: 'flex'} }}>
                <Link
                  to={'/financeqa'}
                  
                >
                  <Typography variant="body2" color="text.primary" sx={{ py: '6px', px: '12px' }}>
                    Document AI
                  </Typography>
                </Link>
                
                
              </Box>}

              { loggedInState &&
                <Box sx={{ display: { xs: 'none', md: 'flex'} }}>
                <Link
                  to={'/mynews'}
                  
                >
                  <Typography variant="body2" color="text.primary" sx={{ py: '6px', px: '12px' }}>
                    My News
                  </Typography>
                </Link>
                
                
              </Box>}

              

            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 0.5,
                alignItems: 'center',
              }}
            >
              <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
              
                {!loggedInState && 
                 <Button
                    color="primary"
                    variant="text"
                    size="small"
                    component={NavLink}
                    href="#"
                    to="/login"
                    >
                    Sign in
                </Button>}
              {!loggedInState && 
              <Button
                color="primary"
                variant="contained"
                size="small"
                component={NavLink}
                href="#"
                to="/register"
                
              >
                Sign up
              </Button>}

              {loggedInState && 
                <Button
                color="primary"
                variant="contained"
                size="small"
                component={NavLink}
                href="#"
                to="/logout"
                
              >
                Logout
              </Button>}
            </Box>
            <Box sx={{ display: { sm: '', md: 'none' } }}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: '30px', p: '4px' }}
              >
                <MenuIcon />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  sx={{
                    minWidth: '60dvw',
                    p: 2,
                    backgroundColor: 'background.paper',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'end',
                      flexGrow: 1,
                    }}
                  >
                    <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                  </Box>
                  { !loggedInState &&
                    <MenuItem onClick={() => scrollToSection('topnews')}>
                    Top News
                  </MenuItem>}
                  { !loggedInState &&
                    <MenuItem onClick={() => scrollToSection('features')}>
                    Features
                  </MenuItem>}
                  
                  <Divider />
                  
                  { !loggedInState &&
                    <MenuItem>
            
                    <Button
                      color="primary"
                      variant="contained"
                      size="small"
                      component={NavLink}
                      href="#"
                      to="/register"
                      
                      sx={{ width: '100%' }}
                    >
                      Sign up
                    </Button>
                  </MenuItem>}
                  {
                  !loggedInState &&
                  <MenuItem>
                    <Button
                        color="primary"
                        variant="outlined"
                        component={NavLink}
                        href="#"
                        
                        to="/login"
                        sx={{ width: '100%' }}
                    >
                      Sign in
                    </Button>
                  </MenuItem>}
                  {
                  loggedInState &&
                    <MenuItem>
                    <Button
                        color="primary"
                        variant="contained"
                        size="small"
                        component={NavLink}
                        href="#"
                        to="/logout"
                        >
                        Logout
                    </Button>
                  </MenuItem>}
                    
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;