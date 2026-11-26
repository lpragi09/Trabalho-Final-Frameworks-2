package br.edu.unilavras.eventos.dto;

public record AuthResponse(String token, String tipo, UsuarioInfo usuario) {
    public record UsuarioInfo(Long id, String nome, String email) {}
}
