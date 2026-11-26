package br.edu.unilavras.eventos.repository;

import br.edu.unilavras.eventos.model.Evento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EventoRepository extends JpaRepository<Evento, Long> {

    @EntityGraph(attributePaths = "categoria")
    @Query("""
            SELECT e FROM Evento e
            WHERE (:busca IS NULL OR LOWER(e.titulo) LIKE LOWER(CONCAT('%', :busca, '%'))
                   OR LOWER(e.local) LIKE LOWER(CONCAT('%', :busca, '%')))
              AND (:categoriaId IS NULL OR e.categoria.id = :categoriaId)
            """)
    Page<Evento> buscar(@Param("busca") String busca,
                        @Param("categoriaId") Long categoriaId,
                        Pageable pageable);

    long countByCategoriaId(Long categoriaId);
}
