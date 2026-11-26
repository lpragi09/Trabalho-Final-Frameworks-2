import { Box, Pagination, Typography } from '@mui/material';

/** Paginação reaproveitada nas listas. A API usa página começando em 0. */
export default function Paginacao({ pagina, totalPaginas, totalElementos, aoMudar, rotulo = 'itens' }) {
  if (!totalElementos) return null;
  return (
    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {totalElementos} {rotulo}
      </Typography>
      {totalPaginas > 1 && (
        <Pagination color="primary" shape="rounded" page={pagina + 1} count={totalPaginas}
          onChange={(_, p) => aoMudar(p - 1)} />
      )}
    </Box>
  );
}
