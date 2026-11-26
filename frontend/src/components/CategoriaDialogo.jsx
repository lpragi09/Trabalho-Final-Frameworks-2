import { useState } from 'react';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';
import { errosDosCampos, mensagemDeErro } from '../api/client';

/** Diálogo de criar/editar categoria. Recebe `categoria` quando é edição. */
export default function CategoriaDialogo({ categoria, aoSalvar, aoFechar }) {
  const [nome, setNome] = useState(categoria?.nome || '');
  const [descricao, setDescricao] = useState(categoria?.descricao || '');
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [salvando, setSalvando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroGeral(null);
    try {
      await aoSalvar({ nome, descricao });
    } catch (err) {
      setErros(errosDosCampos(err));
      setErroGeral(mensagemDeErro(err));
      setSalvando(false);
    }
  };

  return (
    <Dialog open onClose={salvando ? undefined : aoFechar} maxWidth="sm" fullWidth
      slotProps={{ paper: { component: 'form', onSubmit: enviar, noValidate: true } }}>
      <DialogTitle>{categoria ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {erroGeral && <Alert severity="error">{erroGeral}</Alert>}
          <TextField label="Nome" required autoFocus value={nome}
            onChange={(e) => setNome(e.target.value)} error={Boolean(erros.nome)} helperText={erros.nome} />
          <TextField label="Descrição" multiline minRows={2} value={descricao}
            onChange={(e) => setDescricao(e.target.value)} error={Boolean(erros.descricao)} helperText={erros.descricao} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={aoFechar} disabled={salvando}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={salvando}
          startIcon={salvando && <CircularProgress size={16} color="inherit" />}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
