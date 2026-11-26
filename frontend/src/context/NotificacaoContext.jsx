import { createContext, useCallback, useContext, useState } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificacaoContext = createContext(() => {});

/** Mostra avisos rápidos (toasts) de sucesso ou erro em qualquer página. */
export function NotificacaoProvider({ children }) {
  const [aviso, setAviso] = useState(null);

  const notificar = useCallback((mensagem, tipo = 'success') => {
    setAviso({ mensagem, tipo, chave: Date.now() });
  }, []);

  return (
    <NotificacaoContext.Provider value={notificar}>
      {children}
      <Snackbar
        key={aviso?.chave}
        open={Boolean(aviso)}
        autoHideDuration={3500}
        onClose={() => setAviso(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={aviso?.tipo || 'success'} variant="filled" onClose={() => setAviso(null)}>
          {aviso?.mensagem}
        </Alert>
      </Snackbar>
    </NotificacaoContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotificacao() {
  return useContext(NotificacaoContext);
}
