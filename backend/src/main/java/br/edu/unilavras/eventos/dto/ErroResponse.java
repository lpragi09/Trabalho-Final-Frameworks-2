package br.edu.unilavras.eventos.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record ErroResponse(LocalDateTime timestamp, int status, String mensagem, Map<String, String> campos) {}
