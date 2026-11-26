package br.edu.unilavras.eventos.dto;

import br.edu.unilavras.eventos.model.Evento;

import java.time.LocalDateTime;

public record EventoResponse(
        Long id,
        String titulo,
        String descricao,
        LocalDateTime dataHora,
        String local,
        Integer capacidade,
        long inscritos,
        CategoriaResumo categoria
) {
    public record CategoriaResumo(Long id, String nome) {}

    public static EventoResponse de(Evento e, long inscritos) {
        return new EventoResponse(e.getId(), e.getTitulo(), e.getDescricao(), e.getDataHora(),
                e.getLocal(), e.getCapacidade(), inscritos,
                new CategoriaResumo(e.getCategoria().getId(), e.getCategoria().getNome()));
    }
}
