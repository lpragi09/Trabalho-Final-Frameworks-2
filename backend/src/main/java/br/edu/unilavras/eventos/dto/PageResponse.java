package br.edu.unilavras.eventos.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/** Formato estável de paginação devolvido para o front-end. */
public record PageResponse<T>(List<T> conteudo, int pagina, int tamanho, long totalElementos, int totalPaginas) {
    public static <T> PageResponse<T> de(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(),
                page.getTotalElements(), page.getTotalPages());
    }
}
