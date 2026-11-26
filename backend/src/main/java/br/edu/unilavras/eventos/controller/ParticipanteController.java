package br.edu.unilavras.eventos.controller;

import br.edu.unilavras.eventos.dto.PageResponse;
import br.edu.unilavras.eventos.dto.ParticipanteRequest;
import br.edu.unilavras.eventos.dto.ParticipanteResponse;
import br.edu.unilavras.eventos.service.ParticipanteService;
import io.swagger.v3.oas.annotations.Operation;
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
@RequestMapping("/api/eventos/{eventoId}/participantes")
@RequiredArgsConstructor
@Tag(name = "Participantes", description = "Inscrições de participantes em um evento")
@SecurityRequirement(name = "bearerAuth")
public class ParticipanteController {

    private final ParticipanteService participanteService;

    @GetMapping
    @Operation(summary = "Listar inscritos do evento (paginado)")
    public PageResponse<ParticipanteResponse> listar(@PathVariable Long eventoId,
                                                     @RequestParam(defaultValue = "0") int pagina,
                                                     @RequestParam(defaultValue = "10") int tamanho) {
        return participanteService.listar(eventoId,
                PageRequest.of(Math.max(pagina, 0), CategoriaController.limitar(tamanho), Sort.by("nome")));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Inscrever participante")
    @ApiResponse(responseCode = "409", description = "Evento lotado ou e-mail já inscrito")
    public ParticipanteResponse inscrever(@PathVariable Long eventoId, @Valid @RequestBody ParticipanteRequest req) {
        return participanteService.inscrever(eventoId, req);
    }

    @DeleteMapping("/{participanteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Cancelar inscrição")
    public void cancelar(@PathVariable Long eventoId, @PathVariable Long participanteId) {
        participanteService.cancelar(eventoId, participanteId);
    }
}
