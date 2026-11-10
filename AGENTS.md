# echo-web — Guia para agentes

Frontend do Echo: upload, transcrição e resumo de áudios/vídeos.
React 19 + TypeScript, Vite 7, TanStack Router (file-based) + TanStack Query,
Tailwind 4 + shadcn/ui (Radix), Zod + React Hook Form, Biome, Vitest.

## Arquitetura

```
src/
  components/       # componentes compartilhados (Topbar, PlanUsage, shadcn/ui em ui/)
  config/           # constantes e regras de upload (constantes.ts, upload.ts)
  context/          # tema, toast
  hooks/            # auth, mídias, upload, planos, resumo (TanStack Query)
  integrations/     # providers TanStack Query (root-provider, devtools)
  lib/              # api client (axios), limites de plano, utilitários, api-error
  routes/           # rotas file-based do TanStack Router
  schemas/          # validação de formulários (zod)
  types/            # tipos do contrato HTTP (cópia manual do echo-api)
```

- Roteamento file-based: arquivos em `src/routes` geram `routeTree.gen.ts` (não editar manualmente).
- Layouts por prefixo de rota: `_auth` (deslogado), `_authenticate` (logado), `_home`.
- Rotas com componentes colocalizados em `routes/.../-components/`.
- Alias `@` → `src`.

### Convenções de código

- TypeScript strict (`noUncheckedIndexedAccess`, `verbatimModuleSyntax`).
- Biome: **tabs** (indentStyle tab), aspas duplas, lineWidth padrão. `routeTree.gen.ts` e `styles.css` ignorados.
- React 19, hooks funcionais. Sem classes.
- Componentes shadcn em `components/ui` (new-york style). Adicionar via CLI quando necessário.
- Estilização Tailwind 4 (`@tailwindcss/vite`), variáveis CSS, tema claro/escuro via `ThemeContext`.
- Testes: Vitest + jsdom, arquivos `*.test.{ts,tsx}` em `src/`. Sem e2e browser automatizado.

### Autenticação

- Access token em `localStorage` (`auth_token`)? O client better-auth gerencia sessão; API via cookie httpOnly.
- Axios `api` usa `withCredentials: true` (refresh token em cookie).
- Em 401, renovar token uma vez e repetir; se falhar, limpar e ir para `/sign-in`.
- `authClient` (better-auth/react) aponta para `API_URL`.
- Guardas de rota em `beforeLoad` dos layouts (`_auth`, `_authenticate`) via `authClient.getSession()`.

### Dados (TanStack Query)

- Hooks em `src/hooks/use*.ts` encapsulam queries/mutations e invalidações.
- Query keys: `["medias", params]`, `["media", id]`, `["profile"]`, `["tags"]`.
- `staleTime` explícito por hook (1 min mídias, 10 min tags).
- Mutations invalidam queries relevantes (ex.: upload invalida `medias` e `profile`).

### Limites de plano (fonte única: `/me`)

- `useUserLimits` deriva tudo de `GET /me` (plano, minutos usados/restantes, fim do ciclo).
- Regras puras em `src/lib/limits.ts`, cobertas por testes:
  - upload bloqueado sem minutos restantes;
  - duração arredondada para cima em minutos (igual à API);
  - resumo limitado por `maxSummaryAttemptsPerMedia` (não consome minutos).

### Fluxo de upload (2 passos)

1. `POST /files/upload` → `{ url, key, filename, duration }`.
2. `POST /medias` cria a mídia com `url`, `storageKey` (o `key`), etc.
O front **nunca** cria a mídia durante o upload (evita duplicidade). Orquestrado por
`useUploadAndCreateMedia`.

### Contratos (drift manual)

- `src/types` e `src/schemas` são cópia consciente do contrato do `echo-api`.
- Sem verificação automática de drift: ao mudar payload na API, atualize este repo.
- Códigos de erro estáveis consumidos em `src/lib/api-error.ts` (`API_ERROR_MESSAGES`).
  Novo código na API ⇒ adicionar entrada aqui para mensagem amigável em PT-BR.

### API client

- `src/lib/api.ts`: `API_URL` com rewrite de localhost→host da página quando aberto de máquina
  remota (LAN). Axios com `withCredentials`.
- Interceptor de resposta normaliza mensagem via `getApiErrorMessage`.

### Variáveis de ambiente

- `VITE_API_URL` (default `http://localhost:3333`), embutida no bundle em build.
- Em produção defina antes de `pnpm build` (Dockerfile aceita `--build-arg`).

### Comandos

```bash
pnpm dev          # vite :3000
pnpm build        # build + tsc --noEmit
pnpm preview
pnpm typecheck
pnpm test         # vitest
pnpm lint / lint:fix
pnpm format
```

### Onde procurar

| Tarefa | Arquivo(s) |
| --- | --- |
| Nova página/rota | `src/routes` (file-based; regenera `routeTree.gen.ts`) |
| Novo hook de dados | `src/hooks/use*.ts` |
| Novo componente compartilhado | `src/components/` (shadcn em `components/ui`) |
| Tipos do contrato HTTP | `src/types/*.ts` (sincronizar com API) |
| Schemas de formulário | `src/schemas/*.schema.ts` |
| Regras puras de limite | `src/lib/limits.ts` (+ testes) |
| Mensagens de erro amigáveis | `src/lib/api-error.ts` |
| Configuração de upload | `src/config/upload.ts` |
| Cliente HTTP | `src/lib/api.ts` |
| Auth client | `src/lib/auth-client.ts` |

### Não fazer

- Não editar `routeTree.gen.ts` manualmente.
- Não ler limites do `localStorage` (fonte é `/me`).
- Não criar mídia durante o upload (2 passos).
- Não assumir drift automático de contratos: atualizar tipos/schemas manualmente.
- Não usar `any` sem necessidade; strict ativo.

### Particularidades

- Biome usa tabs (diferente da API que usa espaços).
- `noUnusedLocals`/`noUnusedParameters` desligados (mais permissivo).
- `@tanstack/router-plugin` gera rotas em build/dev.
- Componentes de rota colocalizados em pastas `-components`.
- Deploy: nginx com fallback SPA para `index.html`.
