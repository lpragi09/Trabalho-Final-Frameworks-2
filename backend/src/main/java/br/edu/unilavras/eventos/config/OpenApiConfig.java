package br.edu.unilavras.eventos.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

/**
 * Configuração do Swagger (springdoc-openapi).
 * O botão "Authorize" da UI aceita o token JWT devolvido por /auth/login.
 */
@Configuration
@OpenAPIDefinition(info = @Info(
        title = "API Gerenciador de Eventos",
        version = "1.0",
        description = "Trabalho Final de Frameworks Web II (Unilavras): eventos, categorias e participantes, com autenticação JWT."))
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class OpenApiConfig {
}
