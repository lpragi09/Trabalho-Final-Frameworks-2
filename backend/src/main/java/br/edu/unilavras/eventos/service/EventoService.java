package br.edu.unilavras.eventos.service;

import br.edu.unilavras.eventos.dto.EventoRequest;
import br.edu.unilavras.eventos.dto.EventoResponse;
import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.exception.RecursoNaoEncontradoException;
import br.edu.unilavras.eventos.exception.RegraNegocioException;
import br.edu.unilavras.eventos.model.Evento;
import br.edu.unilavras.eventos.repository.EventoRepository;
import br.edu.unilavras.eventos.repository.ParticipanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;
    private final ParticipanteRepository participanteRepository;
    private final CategoriaService categoriaService;

    @Transactional(readOnly = true)
    public PageResponse<EventoResponse> listar(String busca, Long categoriaId, Pageable pageable) {
        String termo = (busca == null || busca.isBlank()) ? null : busca.trim();
        return PageResponse.de(eventoRepository.buscar(termo, categoriaId, pageable).map(this::paraResponse));
    }

    @Transactional(readOnly = true)
    public EventoResponse buscar(Long id) {
        return paraResponse(buscarEntidade(id));
    }

    @Transactional
    public EventoResponse criar(EventoRequest req) {
        Evento evento = new Evento();
        preencher(evento, req);
        return paraResponse(eventoRepository.save(evento));
    }

    @Transactional
    public EventoResponse atualizar(Long id, EventoRequest req) {
        Evento evento = buscarEntidade(id);
        long inscritos = participanteRepository.countByEventoId(id);
        if (req.capacidade() < inscritos) {
            throw new RegraNegocioException(
                    "A capacidade não pode ser menor que o número de inscritos (" + inscritos + ")");
        }
        preencher(evento, req);
        return paraResponse(evento);
    }

    @Transactional
    public void excluir(Long id) {
        eventoRepository.delete(buscarEntidade(id));
    }

    Evento buscarEntidade(Long id) {
        return eventoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Evento " + id + " não encontrado"));
    }

    private void preencher(Evento evento, EventoRequest req) {
        evento.setTitulo(req.titulo().trim());
        evento.setDescricao(req.descricao());
        evento.setDataHora(req.dataHora());
        evento.setLocal(req.local().trim());
        evento.setCapacidade(req.capacidade());
        evento.setCategoria(categoriaService.buscarEntidade(req.categoriaId()));
    }

    private EventoResponse paraResponse(Evento e) {
        return EventoResponse.de(e, participanteRepository.countByEventoId(e.getId()));
    }
}
