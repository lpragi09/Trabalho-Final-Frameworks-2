package br.edu.unilavras.eventos.controller;

import br.edu.unilavras.eventos.dto.CategoriaRequest;
import br.edu.unilavras.eventos.dto.CategoriaResponse;
import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@Tag(name = "Categorias", description = "CRUD de categorias de eventos")
@SecurityRequirement(name = "bearerAuth")
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    @Operation(summary = "Listar categorias (paginado)")
    public PageResponse<CategoriaResponse> listar(
            @Parameter(description = "Página, começando em 0") @RequestParam(defaultValue = "0") int pagina,
            @Parameter(description = "Itens por página") @RequestParam(defaultValue = "10") int tamanho) {
        return categoriaService.listar(PageRequest.of(Math.max(pagina, 0), limitar(tamanho), Sort.by("nome")));
    }

    @GetMapping("/todas")
    @Operation(summary = "Listar todas as categorias", description = "Sem paginação; usado nos selects do front-end.")
    public List<CategoriaResponse> listarTodas() {
        return categoriaService.listarTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar categoria por id")
    @ApiResponse(responseCode = "404", description = "Categoria não encontrada")
    public CategoriaResponse buscar(@PathVariable Long id) {
        return categoriaService.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar categoria")
    @ApiResponse(responseCode = "409", description = "Nome já existe")
    public CategoriaResponse criar(@Valid @RequestBody CategoriaRequest req) {
        return categoriaService.criar(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar categoria")
    public CategoriaResponse atualizar(@PathVariable Long id, @Valid @RequestBody CategoriaRequest req) {
        return categoriaService.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir categoria", description = "Só é permitido se não houver eventos na categoria.")
    @ApiResponse(responseCode = "409", description = "Categoria possui eventos")
    public void excluir(@PathVariable Long id) {
        categoriaService.excluir(id);
    }

    static int limitar(int tamanho) {
        return Math.min(Math.max(tamanho, 1), 50);
    }
}
