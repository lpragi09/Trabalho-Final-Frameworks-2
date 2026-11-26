import { Alert, Button } from '@mui/material';

export default function MensagemErro({ mensagem, aoTentarNovamente }) {
  return (
    <Alert
      severity="error"
      sx={{ my: 2 }}
      action={aoTentarNovamente && (
        <Button color="inherit" size="small" onClick={aoTentarNovamente}>Tentar novamente</Button>
      )}
    >
      {mensagem}
    </Alert>
  );
}
