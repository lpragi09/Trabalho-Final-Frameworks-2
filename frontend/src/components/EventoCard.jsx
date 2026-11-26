import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, Chip, LinearProgress, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/PlaceOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { diaDoMes, formatarHora, mesCurto } from '../utils/formatacao';

export default function EventoCard({ evento }) {
  const ocupacao = Math.min(100, Math.round((evento.inscritos / evento.capacidade) * 100));
  const lotado = evento.inscritos >= evento.capacidade;

  return (
    <Card sx={{ height: '100%', transition: 'transform .15s, box-shadow .15s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(67,56,202,.10)' } }}>
      <CardActionArea component={RouterLink} to={`/eventos/${evento.id}`} sx={{ height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Box sx={{ minWidth: 56, textAlign: 'center', borderRadius: 2, bgcolor: '#eef0ff', color: 'primary.main', py: 1 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{diaDoMes(evento.dataHora)}</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{mesCurto(evento.dataHora)}</Typography>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Chip label={evento.categoria.nome} size="small" sx={{ mb: 0.75, bgcolor: '#fff4dc', color: '#8a5a00', fontWeight: 600 }} />
            <Typography variant="h6" sx={{ fontSize: 17, lineHeight: 1.3 }}>{evento.titulo}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'grid', gap: 0.5, color: 'text.secondary', fontSize: 14 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <ScheduleIcon sx={{ fontSize: 17 }} /> {formatarHora(evento.dataHora)}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PlaceIcon sx={{ fontSize: 17 }} />
            <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{evento.local}</Box>
          </Box>
        </Box>

        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">{evento.inscritos} de {evento.capacidade} vagas</Typography>
            {lotado && <Typography variant="caption" color="error" sx={{ fontWeight: 700 }}>Lotado</Typography>}
          </Box>
          <LinearProgress variant="determinate" value={ocupacao} color={lotado ? 'error' : 'primary'}
            sx={{ height: 6, borderRadius: 3, bgcolor: '#eceaf6' }} />
        </Box>
      </CardActionArea>
    </Card>
  );
}
