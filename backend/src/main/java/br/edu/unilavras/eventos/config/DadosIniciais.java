package br.edu.unilavras.eventos.config;

import br.edu.unilavras.eventos.model.Categoria;
import br.edu.unilavras.eventos.model.Evento;
import br.edu.unilavras.eventos.model.Participante;
import br.edu.unilavras.eventos.model.Usuario;
import br.edu.unilavras.eventos.repository.CategoriaRepository;
import br.edu.unilavras.eventos.repository.EventoRepository;
import br.edu.unilavras.eventos.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/** Popula o banco com dados de exemplo na primeira execução (banco vazio). */
@Component
@RequiredArgsConstructor
public class DadosIniciais implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final CategoriaRepository categoriaRepository;
    private final EventoRepository eventoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.save(Usuario.builder()
                    .nome("Usuário Demo")
                    .email("demo@eventos.com")
                    .senha(passwordEncoder.encode("123456"))
                    .build());
        }
        if (categoriaRepository.count() > 0) {
            return;
        }

        Categoria tecnologia = categoriaRepository.save(Categoria.builder()
                .nome("Tecnologia").descricao("Palestras, hackathons e meetups de tecnologia").build());
        Categoria musica = categoriaRepository.save(Categoria.builder()
                .nome("Música").descricao("Shows, festivais e apresentações").build());
        Categoria esporte = categoriaRepository.save(Categoria.builder()
                .nome("Esporte").descricao("Corridas, campeonatos e torneios").build());
        Categoria educacao = categoriaRepository.save(Categoria.builder()
                .nome("Educação").descricao("Cursos, workshops e semanas acadêmicas").build());

        LocalDate hoje = LocalDate.now();
        criar("Semana Acadêmica de Computação", "Uma semana inteira de palestras, minicursos e maratona de programação.",
                hoje.plusDays(10), 19, "Auditório Unilavras", 150, educacao,
                new String[][]{{"Ana Lima", "ana@email.com"}, {"Bruno Costa", "bruno@email.com"}, {"Carla Dias", "carla@email.com"}});
        criar("Hackathon Lavras 2026", "48 horas para criar soluções para a cidade.",
                hoje.plusDays(18), 9, "Centro de Inovação de Lavras", 60, tecnologia,
                new String[][]{{"Diego Rocha", "diego@email.com"}, {"Elisa Moura", "elisa@email.com"}});
        criar("Meetup React + Spring", "Bate-papo sobre aplicações full stack com React e Spring Boot.",
                hoje.plusDays(5), 20, "Online (Google Meet)", 200, tecnologia, new String[0][]);
        criar("Festival de Bandas Universitárias", "Bandas locais se apresentam na praça.",
                hoje.plusDays(25), 18, "Praça Dr. Augusto Silva", 500, musica,
                new String[][]{{"Felipe Nunes", "felipe@email.com"}});
        criar("Corrida Rústica 5K", "Corrida aberta à comunidade, com kit e medalha.",
                hoje.plusDays(32), 7, "Parque Francisco de Assis", 300, esporte, new String[0][]);
        criar("Oficina de Git e GitHub", "Do primeiro commit ao pull request.",
                hoje.plusDays(3), 14, "Laboratório 4 - Bloco B", 2, educacao,
                new String[][]{{"Gabi Torres", "gabi@email.com"}, {"Hugo Prado", "hugo@email.com"}});
    }

    private void criar(String titulo, String descricao, LocalDate dia, int hora, String local, int capacidade,
                       Categoria categoria, String[][] inscritos) {
        Evento evento = Evento.builder()
                .titulo(titulo).descricao(descricao)
                .dataHora(LocalDateTime.of(dia, LocalTime.of(hora, 0)))
                .local(local).capacidade(capacidade).categoria(categoria)
                .build();
        for (String[] p : inscritos) {
            evento.getParticipantes().add(Participante.builder()
                    .nome(p[0]).email(p[1]).inscritoEm(LocalDateTime.now()).evento(evento).build());
        }
        eventoRepository.save(evento);
    }
}
