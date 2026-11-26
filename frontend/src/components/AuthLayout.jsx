import { Box, Paper, Typography } from '@mui/material';
import EventIcon from '@mui/icons-material/EventAvailable';

/** Moldura comum das telas de Login e Cadastro. */
export default function AuthLayout({ titulo, subtitulo, children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' } }}>
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'space-between', p: 6,
        color: '#fff', background: 'linear-gradient(160deg, #312e81 0%, #4338ca 55%, #6366f1 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EventIcon />
          <Typography variant="h6">Agenda<Box component="span" sx={{ color: 'secondary.main' }}>+</Box></Typography>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', maxWidth: 460 }}>
            Organize eventos e inscrições em um só lugar.
          </Typography>
          <Typography sx={{ mt: 2, opacity: 0.8, maxWidth: 420 }}>
            Crie eventos, separe por categoria e acompanhe quem vai participar, com controle de vagas.
          </Typography>
        </Box>
        <Typography sx={{ opacity: 0.6, fontSize: 13 }}>Trabalho Final · Frameworks Web II · Unilavras</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper sx={{ width: '100%', maxWidth: 400, p: { xs: 3, sm: 4 }, border: '1px solid #e7e5f2' }}>
          <Typography variant="h5" component="h1">{titulo}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3, mt: 0.5 }}>{subtitulo}</Typography>
          {children}
        </Paper>
      </Box>
    </Box>
  );
}
