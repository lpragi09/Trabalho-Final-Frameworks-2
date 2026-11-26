import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Box, Button, InputAdornment, MenuItem, Paper, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CabecalhoPagina from '../components/CabecalhoPagina';
import Carregando from '../components/Carregando';
import EventoCard from '../components/EventoCard';
import MensagemErro from '../components/MensagemErro';
import Paginacao from '../components/Paginacao';
import { categoriasApi, eventosApi } from '../api/services';
import { useApi } from '../hooks/useApi';

export default function EventosPage() {
  // Filtros ficam na URL: dá para recarregar a página e voltar do detalhe sem perder a busca
  const [params, setParams] = useSearchParams();
  const pagina = Number(params.get('pagina') || 0);
  const busca = params.get('busca') || '';
  const categoriaId = params.get('categoria') || '';
  const [textoBusca, setTextoBusca] = useState(busca);
  const [categorias, setCategorias] = useState([]);

  const { dados, carregando, erro, recarregar } = useApi(
    () => eventosApi.listar({ pagina, tamanho: 9, busca: busca || undefined, categoriaId: categoriaId || undefined }),
    [pagina, busca, categoriaId],
  );

  useEffect(() => {
    categoriasApi.todas().then(setCategorias).catch(() => setCategorias([]));
  }, []);

  // Espera o usuário parar de digitar (400 ms) antes de buscar
  useEffect(() => {
    const t = setTimeout(() => {
      if (textoBusca !== busca) atualizarFiltros({ busca: textoBusca });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textoBusca]);

  function atualizarFiltros(novos) {
    const proximo = { busca, categoria: categoriaId, pagina: 0, ...novos };
    const limpo = Object.fromEntries(Object.entries(proximo).filter(([, v]) => v !== '' && v !== 0));
    setParams(limpo);
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Eventos"
        subtitulo="Próximos eventos, ordenados por data."
        acoes={<Button variant="contained" startIcon={<AddIcon />} component={RouterLink} to="/eventos/novo">Novo evento</Button>}
      />

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, border: '1px solid #e7e5f2' }}>
        <TextField size="small" placeholder="Buscar por título ou local" value={textoBusca}
          onChange={(e) => setTextoBusca(e.target.value)}
          slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />
        <TextField size="small" select label="Categoria" value={categoriaId} sx={{ minWidth: { sm: 220 } }} fullWidth={false}
          onChange={(e) => atualizarFiltros({ categoria: e.target.value })}>
          <MenuItem value="">Todas</MenuItem>
          {categorias.map((c) => <MenuItem key={c.id} value={String(c.id)}>{c.nome}</MenuItem>)}
        </TextField>
      </Paper>

      {carregando && <Carregando texto="Buscando eventos..." />}
      {!carregando && erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}

      {!carregando && !erro && dados?.conteudo.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <EventBusyIcon sx={{ fontSize: 48, opacity: 0.5 }} />
          <Typography sx={{ mt: 1 }}>
            {busca || categoriaId ? 'Nenhum evento encontrado com esses filtros.' : 'Nenhum evento cadastrado ainda.'}
          </Typography>
        </Box>
      )}

      {!carregando && !erro && dados?.conteudo.length > 0 && (
        <>
          <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' } }}>
            {dados.conteudo.map((evento) => <EventoCard key={evento.id} evento={evento} />)}
          </Box>
          <Paginacao pagina={dados.pagina} totalPaginas={dados.totalPaginas} totalElementos={dados.totalElementos}
            rotulo={dados.totalElementos === 1 ? 'evento' : 'eventos'}
            aoMudar={(p) => atualizarFiltros({ pagina: p })} />
        </>
      )}
    </>
  );
}
