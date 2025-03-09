import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import App from './App.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#324a9c',   // Your primary color
    },
    secondary: {
      main: '#8413b0',   // Your secondary color
    },
    background: {
      default: '#c0becf', // Default background
    },
    error: {
      main: '#d1060a'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: '60px' }, // rounded buttons everywhere
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#e9e8ed', // matches palette.background.default
        },
      },
    },
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
