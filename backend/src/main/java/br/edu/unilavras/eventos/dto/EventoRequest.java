package br.edu.unilavras.eventos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Schema(description = "Dados para criar ou editar um evento")
public record EventoRequest(
        @Schema(example = "Semana Acadêmica de Computação")
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 120, message = "O título deve ter no máximo 120 caracteres")
        String titulo,

        @Schema(example = "Uma semana de palestras e minicursos.")
        @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres")
        String descricao,

        @Schema(example = "2026-12-10T19:00:00")
        @NotNull(message = "A data e hora são obrigatórias")
        LocalDateTime dataHora,

        @Schema(example = "Auditório Unilavras")
        @NotBlank(message = "O local é obrigatório")
        @Size(max = 150, message = "O local deve ter no máximo 150 caracteres")
        String local,

        @Schema(example = "100")
        @NotNull(message = "A capacidade é obrigatória")
        @Min(value = 1, message = "A capacidade deve ser de pelo menos 1 pessoa")
        @Max(value = 100000, message = "A capacidade máxima é 100000")
        Integer capacidade,

        @Schema(example = "1")
        @NotNull(message = "A categoria é obrigatória")
        Long categoriaId
) {}
