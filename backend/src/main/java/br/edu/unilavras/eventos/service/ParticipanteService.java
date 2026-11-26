package br.edu.unilavras.eventos.service;

import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.dto.ParticipanteRequest;
import br.edu.unilavras.eventos.dto.ParticipanteResponse;
import br.edu.unilavras.eventos.exception.RecursoNaoEncontradoException;
import br.edu.unilavras.eventos.exception.RegraNegocioException;
import br.edu.unilavras.eventos.model.Evento;
import br.edu.unilavras.eventos.model.Participante;
import br.edu.unilavras.eventos.repository.ParticipanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ParticipanteService {

    private final ParticipanteRepository participanteRepository;
    private final EventoService eventoService;

    @Transactional(readOnly = true)
    public PageResponse<ParticipanteResponse> listar(Long eventoId, Pageable pageable) {
        eventoService.buscarEntidade(eventoId);
        return PageResponse.de(participanteRepository.findByEventoId(eventoId, pageable)
                .map(ParticipanteResponse::de));
    }

    @Transactional
    public ParticipanteResponse inscrever(Long eventoId, ParticipanteRequest req) {
        Evento evento = eventoService.buscarEntidade(eventoId);
        String email = req.email().trim().toLowerCase();

        if (participanteRepository.existsByEventoIdAndEmailIgnoreCase(eventoId, email)) {
            throw new RegraNegocioException("Esse e-mail já está inscrito no evento");
        }
        if (participanteRepository.countByEventoId(eventoId) >= evento.getCapacidade()) {
            throw new RegraNegocioException("Evento lotado: capacidade máxima atingida");
        }

        Participante participante = Participante.builder()
                .nome(req.nome().trim())
                .email(email)
                .inscritoEm(LocalDateTime.now())
                .evento(evento)
                .build();
        return ParticipanteResponse.de(participanteRepository.save(participante));
    }

    @Transactional
    public void cancelar(Long eventoId, Long participanteId) {
        Participante participante = participanteRepository.findById(participanteId)
                .filter(p -> p.getEvento().getId().equals(eventoId))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Inscrição não encontrada neste evento"));
        participanteRepository.delete(participante);
    }
}
