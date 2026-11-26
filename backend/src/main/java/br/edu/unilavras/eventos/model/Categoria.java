package br.edu.unilavras.eventos.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categorias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 60)
    private String nome;

    @Column(length = 255)
    private String descricao;

    /** Uma categoria agrupa vários eventos (relacionamento 1:N). */
    @OneToMany(mappedBy = "categoria")
    @Builder.Default
    private List<Evento> eventos = new ArrayList<>();
}
