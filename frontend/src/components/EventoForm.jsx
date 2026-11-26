import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, MenuItem, Paper, TextField } from '@mui/material';
import { errosDosCampos, mensagemDeErro } from '../api/client';
import { categoriasApi } from '../api/services';
import { paraInputDataHora } from '../utils/formatacao';

const vazio = { titulo: '', descricao: '', dataHora: '', local: '', capacidade: '', categoriaId: '' };

/** Formulário usado tanto para criar quanto para editar um evento. */
export default function EventoForm({ inicial, textoBotao, aoSalvar, aoCancelar }) {
  const [form, setForm] = useState(() => (inicial ? {
    titulo: inicial.titulo,
    descricao: inicial.descricao || '',
    dataHora: paraInputDataHora(inicial.dataHora),
    local: inicial.local,
    capacidade: inicial.capacidade,
    categoriaId: inicial.categoria.id,
  } : vazio));
  const [categorias, setCategorias] = useState([]);
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    categoriasApi.todas()
      .then(setCategorias)
      .catch((e) => setErroGeral(mensagemDeErro(e)));
  }, []);

  const alterar = (campo) => (e) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    setErros((er) => ({ ...er, [campo]: undefined }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroGeral(null);
    try {
      await aoSalvar({
        ...form,
        capacidade: form.capacidade === '' ? null : Number(form.capacidade),
        categoriaId: form.categoriaId === '' ? null : Number(form.categoriaId),
        dataHora: form.dataHora || null,
      });
    } catch (err) {
      setErros(errosDosCampos(err));
      setErroGeral(mensagemDeErro(err));
      setSalvando(false);
    }
  };

  const campo = (nome) => ({ value: form[nome], onChange: alterar(nome), error: Boolean(erros[nome]), helperText: erros[nome] });

  return (
    <Paper component="form" onSubmit={enviar} noValidate sx={{ p: { xs: 2.5, sm: 4 }, border: '1px solid #e7e5f2' }}>
      {erroGeral && <Alert severity="error" sx={{ mb: 3 }}>{erroGeral}</Alert>}

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <TextField label="Título" required autoFocus {...campo('titulo')} sx={{ gridColumn: { sm: 'span 2' } }} />
        <TextField label="Descrição" multiline minRows={3} {...campo('descricao')} sx={{ gridColumn: { sm: 'span 2' } }} />
        <TextField label="Data e hora" type="datetime-local" required {...campo('dataHora')}
          slotProps={{ inputLabel: { shrink: true } }} />
        <TextField label="Categoria" select required {...campo('categoriaId')}>
          {categorias.map((c) => <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>)}
        </TextField>
        <TextField label="Local" required {...campo('local')} />
        <TextField label="Capacidade" type="number" required {...campo('capacidade')}
          slotProps={{ htmlInput: { min: 1 } }} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 4 }}>
        <Button onClick={aoCancelar} disabled={salvando}>Cancelar</Button>
        <Button type="submit" variant="contained" disabled={salvando}
          startIcon={salvando && <CircularProgress size={16} color="inherit" />}>
          {salvando ? 'Salvando...' : textoBotao}
        </Button>
      </Box>
    </Paper>
  );
}
