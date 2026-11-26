import { useNavigate, useParams } from 'react-router-dom';
import CabecalhoPagina from '../components/CabecalhoPagina';
import Carregando from '../components/Carregando';
import EventoForm from '../components/EventoForm';
import MensagemErro from '../components/MensagemErro';
import { eventosApi } from '../api/services';
import { useApi } from '../hooks/useApi';
import { useNotificacao } from '../context/NotificacaoContext';

/** Página de cadastro (/eventos/novo) e de edição (/eventos/:id/editar). */
export default function EventoFormPage() {
  const { id } = useParams();
  const edicao = Boolean(id);
  const navigate = useNavigate();
  const notificar = useNotificacao();

  const { dados: evento, carregando, erro, recarregar } = useApi(
    () => (edicao ? eventosApi.buscar(id) : Promise.resolve(null)),
    [id],
  );

  const salvar = async (dadosForm) => {
    const salvo = edicao ? await eventosApi.atualizar(id, dadosForm) : await eventosApi.criar(dadosForm);
    notificar(edicao ? 'Evento atualizado.' : 'Evento criado!');
    navigate(`/eventos/${salvo.id}`);
  };

  return (
    <>
      <CabecalhoPagina
        titulo={edicao ? 'Editar evento' : 'Novo evento'}
        subtitulo={edicao ? evento?.titulo : 'Preencha os dados do evento.'}
      />
      {carregando && <Carregando />}
      {!carregando && erro && <MensagemErro mensagem={erro} aoTentarNovamente={recarregar} />}
      {!carregando && !erro && (
        <EventoForm
          key={evento?.id || 'novo'}
          inicial={evento}
          textoBotao={edicao ? 'Salvar alterações' : 'Criar evento'}
          aoSalvar={salvar}
          aoCancelar={() => navigate(-1)}
        />
      )}
    </>
  );
}
