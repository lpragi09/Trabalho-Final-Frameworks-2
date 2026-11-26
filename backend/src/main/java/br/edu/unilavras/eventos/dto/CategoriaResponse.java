package br.edu.unilavras.eventos.dto;

import br.edu.unilavras.eventos.model.Categoria;

public record CategoriaResponse(Long id, String nome, String descricao, long totalEventos) {
    public static CategoriaResponse de(Categoria c, long totalEventos) {
        return new CategoriaResponse(c.getId(), c.getNome(), c.getDescricao(), totalEventos);
    }
}
