import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { NotificacaoProvider } from './context/NotificacaoContext';
import { theme } from './theme';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NotificacaoProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificacaoProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
