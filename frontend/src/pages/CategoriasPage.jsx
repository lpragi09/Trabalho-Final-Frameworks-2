import { useState } from 'react';
import {
  Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/EditOutlined';
import CabecalhoPagina from '../components/CabecalhoPagina';
import Carregando from '../components/Carregando';
import CategoriaDialogo from '../components/CategoriaDialogo';
import DialogoConfirmacao from '../components/DialogoConfirmacao';
import MensagemErro from '../components/MensagemErro';
import Paginacao from '../components/Paginacao';
import { mensagemDeErro } from '../api/client';
import { categoriasApi } from '../api/services';
import { useApi } from '../hooks/useApi';
import { useNotificacao } from '../context/NotificacaoContext';

export default function CategoriasPage() {
  const notificar = useNotificacao();
  const [pagina, setPagina] = useState(0);
  const [editando, setEditando] = useState(null); // null = fechado, {} = nova, categoria = edição
  const [excluindo, setExcluindo] = useState(null);
  const [processando, setProcessando] = useState(false);

  const { dados, carregando, erro, recarregar } = useApi(
    () => categoriasApi.listar({ pagina, tamanho: 8 }),
    [pagina],
  );

  const salvar = async (dadosForm) => {
    if (editando.id) await categoriasApi.atualizar(editando.id, dadosForm);
    else await categoriasApi.criar(dadosForm);
    notificar(editando.id ? 'Categoria atualizada.' : 'Categoria criada!');
    setEditando(null);
    recarregar();
  };

  const excluir = async () => {
    setProcessando(true);
    try {
      await categoriasApi.excluir(excluindo.id);
      notificar('Categoria excluída.');
      if (dados.conteudo.length === 1 && pagina > 0) setPagina(pagina - 1);
      else recarregar();
    } catch (e) {
      notificar(mensagemDeErro(e), 'error');
    } finally {
      setProcessando(false);
      setExcluindo(null);
    }
  };

  return (
    <>
      <CabecalhoPagina
        titulo="Categorias"
        subtitulo="Organize os eventos por tipo."
        acoes={<Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditando({})}>Nova categoria</Button>}
      />

      {carregando && <Carregando />}
      {!carregando && erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}
      {!carregando && !erro && (
        <>
          <TableContainer component={Paper} sx={{ border: '1px solid #e7e5f2' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary' } }}>
                  <TableCell>Nome</TableCell>
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Descrição</TableCell>
                  <TableCell align="center">Eventos</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dados.conteudo.length === 0 && (
                  <TableRow><TableCell colSpan={4}><Typography color="text.secondary" sx={{ py: 2 }}>Nenhuma categoria cadastrada.</Typography></TableCell></TableRow>
                )}
                {dados.conteudo.map((c) => (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{c.nome}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' }, color: 'text.secondary' }}>{c.descricao || '—'}</TableCell>
                    <TableCell align="center">{c.totalEventos}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      <Tooltip title="Editar"><IconButton aria-label={`Editar ${c.nome}`} onClick={() => setEditando(c)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                      <Tooltip title="Excluir"><IconButton aria-label={`Excluir ${c.nome}`} onClick={() => setExcluindo(c)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Paginacao pagina={dados.pagina} totalPaginas={dados.totalPaginas} totalElementos={dados.totalElementos}
            rotulo={dados.totalElementos === 1 ? 'categoria' : 'categorias'} aoMudar={setPagina} />
        </>
      )}

      {editando && (
        <CategoriaDialogo categoria={editando.id ? editando : null} aoSalvar={salvar} aoFechar={() => setEditando(null)} />
      )}

      <DialogoConfirmacao
        aberto={Boolean(excluindo)}
        titulo="Excluir categoria?"
        mensagem={`A categoria "${excluindo?.nome}" será removida. Categorias com eventos não podem ser excluídas.`}
        carregando={processando}
        aoConfirmar={excluir}
        aoCancelar={() => setExcluindo(null)}
      />
    </>
  );
}
