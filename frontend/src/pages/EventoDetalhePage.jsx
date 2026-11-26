import { useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, LinearProgress, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Carregando from '../components/Carregando';
import DialogoConfirmacao from '../components/DialogoConfirmacao';
import MensagemErro from '../components/MensagemErro';
import ParticipantesSecao from '../components/ParticipantesSecao';
import { mensagemDeErro } from '../api/client';
import { eventosApi } from '../api/services';
import { useApi } from '../hooks/useApi';
import { useNotificacao } from '../context/NotificacaoContext';
import { formatarDataHora } from '../utils/formatacao';

export default function EventoDetalhePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notificar = useNotificacao();
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const { dados: evento, carregando, erro, recarregar } = useApi(() => eventosApi.buscar(id), [id]);

  const excluir = async () => {
    setExcluindo(true);
    try {
      await eventosApi.excluir(id);
      notificar('Evento excluído.');
      navigate('/eventos');
    } catch (e) {
      notificar(mensagemDeErro(e), 'error');
      setExcluindo(false);
      setConfirmando(false);
    }
  };

  if (carregando && !evento) return <Carregando texto="Carregando evento..." />;
  if (erro) {
    return (
      <>
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/eventos">Voltar</Button>
        <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />
      </>
    );
  }

  const ocupacao = Math.min(100, Math.round((evento.inscritos / evento.capacidade) * 100));
  const lotado = evento.inscritos >= evento.capacidade;

  return (
    <>
      <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/eventos" sx={{ mb: 2 }}>Todos os eventos</Button>

      <Paper sx={{ p: { xs: 2.5, sm: 4 }, border: '1px solid #e7e5f2', mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <Chip label={evento.categoria.nome} size="small" sx={{ bgcolor: '#fff4dc', color: '#8a5a00', fontWeight: 600, mb: 1 }} />
            <Typography variant="h4" component="h1">{evento.titulo}</Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 1.5, color: 'text.secondary', flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><ScheduleIcon fontSize="small" /> {formatarDataHora(evento.dataHora)}</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}><PlaceIcon fontSize="small" /> {evento.local}</Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <Button variant="outlined" startIcon={<EditIcon />} component={RouterLink} to={`/eventos/${evento.id}/editar`}>Editar</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmando(true)}>Excluir</Button>
          </Box>
        </Box>

        {evento.descricao && <Typography sx={{ mt: 3, whiteSpace: 'pre-line' }}>{evento.descricao}</Typography>}

        <Box sx={{ mt: 3, maxWidth: 420 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">{evento.inscritos} de {evento.capacidade} vagas preenchidas</Typography>
            {lotado && <Typography variant="body2" color="error" sx={{ fontWeight: 700 }}>Lotado</Typography>}
          </Box>
          <LinearProgress variant="determinate" value={ocupacao} color={lotado ? 'error' : 'primary'} sx={{ height: 8, borderRadius: 4, bgcolor: '#eceaf6' }} />
        </Box>
      </Paper>

      <ParticipantesSecao evento={evento} aoAlterar={recarregar} />

      <DialogoConfirmacao
        aberto={confirmando}
        titulo="Excluir evento?"
        mensagem={`"${evento.titulo}" e todas as ${evento.inscritos} inscrições serão removidos. Essa ação não pode ser desfeita.`}
        carregando={excluindo}
        aoConfirmar={excluir}
        aoCancelar={() => setConfirmando(false)}
      />
    </>
  );
}
