import { Box, Typography } from '@mui/material';

export default function CabecalhoPagina({ titulo, subtitulo, acoes }) {
  return (
    <Box sx={{ display: 'flex', alignItems: { sm: 'flex-end' }, justifyContent: 'space-between', gap: 2, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
      <Box>
        <Typography variant="h4" component="h1">{titulo}</Typography>
        {subtitulo && <Typography color="text.secondary" sx={{ mt: 0.5 }}>{subtitulo}</Typography>}
      </Box>
      {acoes && <Box sx={{ display: 'flex', gap: 1 }}>{acoes}</Box>}
    </Box>
  );
}
