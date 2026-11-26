import { useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Paper, TextField, Tooltip, Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAddAlt1';
import CloseIcon from '@mui/icons-material/Close';
import Carregando from './Carregando';
import DialogoConfirmacao from './DialogoConfirmacao';
import MensagemErro from './MensagemErro';
import Paginacao from './Paginacao';
import { errosDosCampos, mensagemDeErro } from '../api/client';
import { participantesApi } from '../api/services';
import { useApi } from '../hooks/useApi';
import { useNotificacao } from '../context/NotificacaoContext';

/** Lista paginada de inscritos + formulário de inscrição de um evento. */
export default function ParticipantesSecao({ evento, aoAlterar }) {
  const notificar = useNotificacao();
  const [pagina, setPagina] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '' });
  const [erros, setErros] = useState({});
  const [erroForm, setErroForm] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [removendo, setRemovendo] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  const { dados, carregando, erro, recarregar } = useApi(
    () => participantesApi.listar(evento.id, { pagina, tamanho: 8 }),
    [evento.id, pagina],
  );

  const lotado = evento.inscritos >= evento.capacidade;

  const inscrever = async (e) => {
    e.preventDefault();
    setSalvando(true);
    setErroForm(null);
    setErros({});
    try {
      await participantesApi.inscrever(evento.id, form);
      setForm({ nome: '', email: '' });
      notificar('Participante inscrito!');
      recarregar();
      aoAlterar();
    } catch (err) {
      setErros(errosDosCampos(err));
      setErroForm(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  };

  const cancelarInscricao = async () => {
    setExcluindo(true);
    try {
      await participantesApi.cancelar(evento.id, removendo.id);
      notificar('Inscrição cancelada.');
      // Se era o último item da página, volta uma página
      if (dados.conteudo.length === 1 && pagina > 0) setPagina(pagina - 1);
      else recarregar();
      aoAlterar();
    } catch (err) {
      notificar(mensagemDeErro(err), 'error');
    } finally {
      setExcluindo(false);
      setRemovendo(null);
    }
  };

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 340px' }, alignItems: 'start' }}>
      <Paper sx={{ p: { xs: 2, sm: 3 }, border: '1px solid #e7e5f2' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Participantes inscritos</Typography>
        {carregando && <Carregando texto="Carregando inscritos..." />}
        {!carregando && erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}
        {!carregando && !erro && dados.conteudo.length === 0 && (
          <Typography color="text.secondary" sx={{ py: 3 }}>Ninguém se inscreveu ainda.</Typography>
        )}
        {!carregando && !erro && dados.conteudo.length > 0 && (
          <List disablePadding>
            {dados.conteudo.map((p) => (
              <ListItem key={p.id} divider
                secondaryAction={(
                  <Tooltip title="Cancelar inscrição">
                    <IconButton edge="end" aria-label={`Cancelar inscrição de ${p.nome}`} onClick={() => setRemovendo(p)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#eef0ff', color: 'primary.main', fontWeight: 700 }}>{p.nome[0].toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={p.nome} secondary={p.email} />
              </ListItem>
            ))}
          </List>
        )}
        {dados && (
          <Paginacao pagina={dados.pagina} totalPaginas={dados.totalPaginas} totalElementos={dados.totalElementos}
            rotulo={dados.totalElementos === 1 ? 'inscrito' : 'inscritos'} aoMudar={setPagina} />
        )}
      </Paper>

      <Paper component="form" onSubmit={inscrever} noValidate sx={{ p: 3, border: '1px solid #e7e5f2' }}>
        <Typography variant="h6">Nova inscrição</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {lotado ? 'O evento está lotado.' : `${evento.capacidade - evento.inscritos} ${evento.capacidade - evento.inscritos === 1 ? 'vaga restante' : 'vagas restantes'}.`}
        </Typography>
        {erroForm && <Alert severity="error" sx={{ mb: 2 }}>{erroForm}</Alert>}
        <Box sx={{ display: 'grid', gap: 2 }}>
          <TextField size="small" label="Nome" value={form.nome} disabled={lotado}
            onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
            error={Boolean(erros.nome)} helperText={erros.nome} />
          <TextField size="small" label="E-mail" type="email" value={form.email} disabled={lotado}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            error={Boolean(erros.email)} helperText={erros.email} />
          <Button type="submit" variant="contained" disabled={salvando || lotado}
            startIcon={salvando ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}>
            Inscrever
          </Button>
        </Box>
      </Paper>

      <DialogoConfirmacao
        aberto={Boolean(removendo)}
        titulo="Cancelar inscrição?"
        mensagem={`${removendo?.nome} deixará de estar inscrito(a) neste evento.`}
        textoConfirmar="Cancelar inscrição"
        carregando={excluindo}
        aoConfirmar={cancelarInscricao}
        aoCancelar={() => setRemovendo(null)}
      />
    </Box>
  );
}
