import { Box, CircularProgress, Typography } from '@mui/material';

export default function Carregando({ texto = 'Carregando...' }) {
  return (
    <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }} role="status">
      <CircularProgress />
      <Typography color="text.secondary">{texto}</Typography>
    </Box>
  );
}
