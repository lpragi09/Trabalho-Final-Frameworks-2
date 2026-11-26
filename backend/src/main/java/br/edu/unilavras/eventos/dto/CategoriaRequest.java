package br.edu.unilavras.eventos.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para criar ou editar uma categoria")
public record CategoriaRequest(
        @Schema(example = "Tecnologia")
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 60, message = "O nome deve ter no máximo 60 caracteres")
        String nome,

        @Schema(example = "Palestras, hackathons e meetups de tecnologia")
        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres")
        String descricao
) {}
