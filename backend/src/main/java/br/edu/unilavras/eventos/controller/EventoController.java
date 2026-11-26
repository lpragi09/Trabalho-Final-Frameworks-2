package br.edu.unilavras.eventos.controller;

import br.edu.unilavras.eventos.dto.EventoRequest;
import br.edu.unilavras.eventos.dto.EventoResponse;
import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.service.EventoService;
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

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
@Tag(name = "Eventos", description = "CRUD completo de eventos")
@SecurityRequirement(name = "bearerAuth")
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    @Operation(summary = "Listar eventos (paginado)", description = "Permite buscar por título/local e filtrar por categoria.")
    public PageResponse<EventoResponse> listar(
            @Parameter(description = "Texto para buscar no título ou local") @RequestParam(required = false) String busca,
            @Parameter(description = "Filtrar por categoria") @RequestParam(required = false) Long categoriaId,
            @Parameter(description = "Página, começando em 0") @RequestParam(defaultValue = "0") int pagina,
            @Parameter(description = "Itens por página") @RequestParam(defaultValue = "9") int tamanho) {
        return eventoService.listar(busca, categoriaId,
                PageRequest.of(Math.max(pagina, 0), CategoriaController.limitar(tamanho), Sort.by("dataHora")));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar evento por id")
    @ApiResponse(responseCode = "404", description = "Evento não encontrado")
    public EventoResponse buscar(@PathVariable Long id) {
        return eventoService.buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar evento")
    @ApiResponse(responseCode = "400", description = "Campos inválidos")
    public EventoResponse criar(@Valid @RequestBody EventoRequest req) {
        return eventoService.criar(req);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar evento")
    @ApiResponse(responseCode = "409", description = "Capacidade menor que o número de inscritos")
    public EventoResponse atualizar(@PathVariable Long id, @Valid @RequestBody EventoRequest req) {
        return eventoService.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Excluir evento", description = "Remove também as inscrições do evento.")
    public void excluir(@PathVariable Long id) {
        eventoService.excluir(id);
    }
}
