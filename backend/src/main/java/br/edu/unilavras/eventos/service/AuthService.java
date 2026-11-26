package br.edu.unilavras.eventos.service;

import br.edu.unilavras.eventos.dto.AuthResponse;
import br.edu.unilavras.eventos.dto.LoginRequest;
import br.edu.unilavras.eventos.dto.RegisterRequest;
import br.edu.unilavras.eventos.exception.RegraNegocioException;
import br.edu.unilavras.eventos.model.Usuario;
import br.edu.unilavras.eventos.repository.UsuarioRepository;
import br.edu.unilavras.eventos.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registrar(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (usuarioRepository.existsByEmail(email)) {
            throw new RegraNegocioException("Esse e-mail já está cadastrado");
        }
        Usuario usuario = usuarioRepository.save(Usuario.builder()
                .nome(req.nome().trim())
                .email(email)
                .senha(passwordEncoder.encode(req.senha()))
                .build());
        return gerarResposta(usuario);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(req.email().trim().toLowerCase())
                .filter(u -> passwordEncoder.matches(req.senha(), u.getSenha()))
                .orElseThrow(() -> new BadCredentialsException("Credenciais inválidas"));
        return gerarResposta(usuario);
    }

    private AuthResponse gerarResposta(Usuario u) {
        return new AuthResponse(jwtService.gerarToken(u.getEmail()), "Bearer",
                new AuthResponse.UsuarioInfo(u.getId(), u.getNome(), u.getEmail()));
    }
}
