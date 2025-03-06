import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: '#7209B7',
      light: '#9D4EDD',
      dark: '#560BAD', 
    },
    secondary: {
      main: '#F72585', 
      light: '#F953A0',
      dark: '#C81D69', 
    },
    background: {
      default: '#FCFCFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1F1F1F',  
      secondary: '#575757',
    },
    error: {
      main: '#E63946',
    },
    warning: {
      main: '#FB8500',
    },
    success: {
      main: '#06D6A0',
    },
    info: {
      main: '#4CC9F0',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Inter', 'Roboto', sans-serif",
    h1: {
      fontSize: '4.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '3.5rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.75rem',
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '0em',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More modern, rounded corners
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(0, 0, 0, 0.05)',
    // ...rest of shadows remain default
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(114, 9, 183, 0.2)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

export default theme;