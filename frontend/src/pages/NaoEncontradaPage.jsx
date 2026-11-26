import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

export default function NaoEncontradaPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 10 }}>
      <Typography variant="h4" component="h1">Página não encontrada</Typography>
      <Typography color="text.secondary" sx={{ my: 2 }}>O endereço acessado não existe.</Typography>
      <Button variant="contained" component={RouterLink} to="/eventos">Ir para os eventos</Button>
    </Box>
  );
}
