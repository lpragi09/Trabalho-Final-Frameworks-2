package br.edu.unilavras.eventos.dto;

import br.edu.unilavras.eventos.model.Participante;

import java.time.LocalDateTime;

public record ParticipanteResponse(Long id, String nome, String email, LocalDateTime inscritoEm) {
    public static ParticipanteResponse de(Participante p) {
        return new ParticipanteResponse(p.getId(), p.getNome(), p.getEmail(), p.getInscritoEm());
    }
}
