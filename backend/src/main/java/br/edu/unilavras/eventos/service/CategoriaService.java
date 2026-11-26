package br.edu.unilavras.eventos.service;

import br.edu.unilavras.eventos.dto.CategoriaRequest;
import br.edu.unilavras.eventos.dto.CategoriaResponse;
import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.exception.RecursoNaoEncontradoException;
import br.edu.unilavras.eventos.exception.RegraNegocioException;
import br.edu.unilavras.eventos.model.Categoria;
import br.edu.unilavras.eventos.repository.CategoriaRepository;
import br.edu.unilavras.eventos.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final EventoRepository eventoRepository;

    @Transactional(readOnly = true)
    public PageResponse<CategoriaResponse> listar(Pageable pageable) {
        return PageResponse.de(categoriaRepository.findAll(pageable).map(this::paraResponse));
    }

    /** Lista completa (sem paginação) usada para preencher o select do formulário de evento. */
    @Transactional(readOnly = true)
    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll(Sort.by("nome")).stream().map(this::paraResponse).toList();
    }

    @Transactional(readOnly = true)
    public CategoriaResponse buscar(Long id) {
        return paraResponse(buscarEntidade(id));
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest req) {
        if (categoriaRepository.existsByNomeIgnoreCase(req.nome().trim())) {
            throw new RegraNegocioException("Já existe uma categoria com esse nome");
        }
        Categoria categoria = Categoria.builder()
                .nome(req.nome().trim())
                .descricao(req.descricao())
                .build();
        return paraResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest req) {
        Categoria categoria = buscarEntidade(id);
        if (categoriaRepository.existsByNomeIgnoreCaseAndIdNot(req.nome().trim(), id)) {
            throw new RegraNegocioException("Já existe uma categoria com esse nome");
        }
        categoria.setNome(req.nome().trim());
        categoria.setDescricao(req.descricao());
        return paraResponse(categoria);
    }

    @Transactional
    public void excluir(Long id) {
        Categoria categoria = buscarEntidade(id);
        if (eventoRepository.countByCategoriaId(id) > 0) {
            throw new RegraNegocioException("Não é possível excluir: existem eventos nessa categoria");
        }
        categoriaRepository.delete(categoria);
    }

    Categoria buscarEntidade(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Categoria " + id + " não encontrada"));
    }

    private CategoriaResponse paraResponse(Categoria c) {
        return CategoriaResponse.de(c, eventoRepository.countByCategoriaId(c.getId()));
    }
}
