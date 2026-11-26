# Agenda+ · Gerenciador de Eventos

Aplicação full stack feita para o **Trabalho Final de Frameworks Web II** (Unilavras).
Permite cadastrar eventos, organizá-los por categoria e controlar as inscrições de participantes, respeitando a capacidade de cada evento. O acesso é protegido por login com **JWT**, e a API está documentada com **Swagger**.

## Integrantes

- Luiz Paulo Ragi
- Israel Messias
- Adalbert

## Links

| O quê | Link |
|---|---|
| Vídeo de demonstração | _cole aqui o link do YouTube (Não listado) ou Drive_ |
| Repositório | https://github.com/lpragi09/Trabalho-Final-Frameworks-2 |
| Front-end (Vercel) | https://trabalho-final-frameworks-2.vercel.app |
| API e Swagger | rodam localmente: http://localhost:8080 e http://localhost:8080/swagger-ui.html |

> A API não está hospedada. O front publicado na Vercel conversa com a API rodando em `localhost:8080`, então suba o back-end (passo 1 abaixo) antes de abrir o link. Se o navegador pedir permissão para acessar a rede local, aceite.

## Tecnologias

**Back-end:** Java 25, Spring Boot 4.1, Spring Web MVC, Spring Data JPA, Spring Security + JWT (jjwt), Bean Validation, springdoc-openapi (Swagger), H2 (padrão) ou PostgreSQL, Lombok.

**Front-end:** React 19 + Vite, React Router, Axios, Material UI (MUI).

## Funcionalidades

- Cadastro e login de usuários (`/auth/register` e `/auth/login`) com token JWT.
- Todas as rotas `/api/**` exigem o token no cabeçalho `Authorization: Bearer <token>`.
- **Eventos:** CRUD completo, busca por título/local, filtro por categoria e paginação.
- **Categorias:** CRUD completo com paginação (não deixa excluir categoria que tem eventos).
- **Participantes:** inscrição e cancelamento por evento, bloqueando e-mail repetido e evento lotado.
- Indicadores de carregamento, mensagens de erro vindas da API e validação campo a campo nos formulários.
- Dados de exemplo criados automaticamente na primeira execução.

## Modelo de dados

```
Categoria 1 ──── N Evento 1 ──── N Participante
Usuario (login/JWT)
```

## Estrutura

```
backend/   API Spring Boot
  config/       SecurityConfig, OpenApiConfig, DadosIniciais (seed)
  controller/   AuthController, EventoController, CategoriaController, ParticipanteController
  dto/          records de entrada (Request) e saída (Response)
  exception/    exceções de negócio + GlobalExceptionHandler
  model/        entidades JPA (Usuario, Categoria, Evento, Participante)
  repository/   interfaces Spring Data JPA
  security/     JwtService e JwtAuthFilter
  service/      regras de negócio
frontend/  React (Vite)
  api/          instância do Axios (envia o token) e funções de cada recurso
  components/   Layout, RotaProtegida, EventoCard, EventoForm, Paginacao, diálogos...
  context/      AuthContext (login/logout) e NotificacaoContext (avisos)
  hooks/        useApi (loading / erro / dados)
  pages/        Login, Registro, Eventos, Detalhe do evento, Formulário, Categorias
```

## Como rodar localmente

### Pré-requisitos

- **JDK 25** (ex.: Eclipse Temurin 25). O Maven não precisa ser instalado: o projeto usa o Maven Wrapper (`mvnw`).
- **Node.js 20+** e npm.

### 1. Back-end (porta 8080)

```bash
cd backend
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run
```

- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- Console do H2: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/eventos`, usuário `sa`, sem senha)

Usuário de teste criado automaticamente: **demo@eventos.com** / **123456**.

#### Variáveis de ambiente (opcionais)

| Variável | Padrão | Para que serve |
|---|---|---|
| `PORT` | `8080` | Porta da API |
| `DB_URL` | H2 em arquivo (`./data/eventos`) | Ex.: `jdbc:postgresql://localhost:5432/eventos` |
| `DB_USER` / `DB_PASSWORD` | `sa` / vazio | Credenciais do banco |
| `JWT_SECRET` | valor de desenvolvimento | Segredo do JWT (mínimo 32 caracteres) |
| `JWT_EXPIRACAO_MS` | `86400000` (24 h) | Validade do token |
| `CORS_ORIGINS` | `localhost:5173` e o site da Vercel | Endereços do front liberados no CORS |

### 2. Front-end (porta 5173)

```bash
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. Se a API estiver em outro endereço, crie `frontend/.env.local` com:

```
VITE_API_URL=http://localhost:8080
```

## Testando no Swagger

1. Abra `/swagger-ui.html`.
2. Execute `POST /auth/login` com `{"email":"demo@eventos.com","senha":"123456"}` e copie o `token`.
3. Clique em **Authorize**, cole o token e teste as rotas de eventos, categorias e participantes.

## Endpoints

| Método | Rota | Protegida |
|---|---|---|
| POST | `/auth/register` | não |
| POST | `/auth/login` | não |
| GET / POST | `/api/eventos` | sim |
| GET / PUT / DELETE | `/api/eventos/{id}` | sim |
| GET / POST | `/api/categorias` | sim |
| GET | `/api/categorias/todas` | sim |
| GET / PUT / DELETE | `/api/categorias/{id}` | sim |
| GET / POST | `/api/eventos/{eventoId}/participantes` | sim |
| DELETE | `/api/eventos/{eventoId}/participantes/{id}` | sim |

## Deploy

- **Front:** publicado na Vercel (Root Directory `frontend`). O `vercel.json` trata as rotas do React Router.
- **API:** roda localmente. Se quiser hospedar, o `backend/Dockerfile` já está pronto (ex.: Render); defina `JWT_SECRET`, `CORS_ORIGINS` e, para PostgreSQL, `DB_URL`, `DB_USER` e `DB_PASSWORD`, e aponte `VITE_API_URL` do front para a nova URL.
