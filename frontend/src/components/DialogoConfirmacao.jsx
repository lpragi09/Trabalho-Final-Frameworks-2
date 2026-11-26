import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function DialogoConfirmacao({ aberto, titulo, mensagem, textoConfirmar = 'Excluir', carregando, aoConfirmar, aoCancelar }) {
  return (
    <Dialog open={aberto} onClose={carregando ? undefined : aoCancelar} maxWidth="xs" fullWidth>
      <DialogTitle>{titulo}</DialogTitle>
      <DialogContent>
        <DialogContentText>{mensagem}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={aoCancelar} disabled={carregando}>Cancelar</Button>
        <Button onClick={aoConfirmar} color="error" variant="contained" disabled={carregando}
          startIcon={carregando && <CircularProgress size={16} color="inherit" />}>
          {textoConfirmar}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
