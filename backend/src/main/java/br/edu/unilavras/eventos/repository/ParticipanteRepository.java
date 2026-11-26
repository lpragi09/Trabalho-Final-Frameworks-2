package br.edu.unilavras.eventos.repository;

import br.edu.unilavras.eventos.model.Participante;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    Page<Participante> findByEventoId(Long eventoId, Pageable pageable);
    long countByEventoId(Long eventoId);
    boolean existsByEventoIdAndEmailIgnoreCase(Long eventoId, String email);
}
