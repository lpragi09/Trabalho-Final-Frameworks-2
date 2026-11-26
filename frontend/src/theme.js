import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4338ca', dark: '#3730a3', light: '#6366f1' },
    secondary: { main: '#f59e0b' },
    background: { default: '#f6f5fb', paper: '#ffffff' },
    text: { primary: '#1e1b3a', secondary: '#5f5b7a' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
      defaultProps: { elevation: 0 },
    },
    MuiCard: {
      styleOverrides: { root: { border: '1px solid #e7e5f2' } },
    },
    MuiTextField: { defaultProps: { fullWidth: true } },
  },
});
