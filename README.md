# echo-web

Frontend do Echo — upload, transcrição e resumo de áudios e vídeos.

## Stack

- React 19 + TypeScript
- Vite 7
- TanStack Router (file-based) + TanStack Query
- Tailwind CSS 4 + shadcn/ui (Radix)
- Zod + React Hook Form
- Biome (lint/format), Vitest (testes)

## Setup

Requisitos: Node.js 22+ e pnpm. A API (`echo-api`) precisa estar rodando.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

A aplicação sobe em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição |
| --- | --- |
| `VITE_API_URL` | URL base da API (default `http://localhost:3333`) |

Variáveis `VITE_*` são embutidas no bundle em tempo de build — em produção, defina-as antes de
`pnpm build` (o `Dockerfile` aceita `--build-arg VITE_API_URL=...`).

## Scripts

| Script | Descrição |
| --- | --- |
| `pnpm dev` | servidor de desenvolvimento na porta 3000 |
| `pnpm build` | build de produção em `dist/` + typecheck |
| `pnpm preview` | serve o build localmente |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | testes com Vitest |
| `pnpm lint` | Biome check |
| `pnpm lint:fix` | Biome check + fix |

## Estrutura

```
src/
  components/       # componentes compartilhados (Topbar, PlanUsage, shadcn/ui, ...)
  config/           # constantes e regras de upload
  context/          # tema
  hooks/            # auth, mídias, upload, planos, resumo
  integrations/     # providers do TanStack Query
  lib/              # api client, limites de plano, utilitários
  routes/           # rotas file-based do TanStack Router
  schemas/          # validação de formulários (zod)
  types/            # tipos do contrato HTTP (duplicados de echo-api)
```

## Autenticação

- O access token fica em `localStorage` (`auth_token`).
- O refresh token fica em cookie `httpOnly`; o axios usa `withCredentials: true`.
- Em um `401`, o cliente renova o token uma vez e repete a requisição original. Se o refresh
  falhar, o token é limpo e o usuário vai para `/sign-in`.

## Limites de plano

`useUserLimits` deriva tudo de `GET /me` (plano, minutos usados/restantes e fim do ciclo). Não há
mais leitura de limites do `localStorage`. As regras puras ficam em `src/lib/limits.ts` e são
cobertas por testes:

- upload é bloqueado quando não há minutos restantes;
- a duração é arredondada para cima em minutos, igual à API;
- resumo é limitado por `maxSummaryAttemptsPerMedia` (resumos não consomem minutos).

## Fluxo de upload

1. `POST /files/upload` envia o arquivo e retorna `{ url, key, filename, duration }`.
2. `POST /medias` cria a mídia com `url`, `storageKey` (o `key`), `filename`, `duration`, `type`,
   `language`, `tags` e `prompt` opcional.

O front nunca cria a mídia durante o upload — isso evita duplicidade.

## Contratos

Os tipos em `src/types` e os schemas em `src/schemas` são uma cópia consciente do contrato exposto
pelo `echo-api`. Como os repositórios são independentes, não existe verificação automática de
drift: ao mudar um payload na API, atualize este repositório.

## Deploy

```bash
docker build --build-arg VITE_API_URL=https://api.example.com -t echo-web .
docker run -p 8080:80 echo-web
```

A imagem usa nginx com fallback de SPA para `index.html`.

## Stack completa com Docker

Para subir API, worker e web juntos, use o profile `full` do compose do
`echo-api` (os três repositórios precisam estar em diretórios irmãos):

```bash
cd ../echo-api
docker compose --profile full up -d --build
```

A web fica em `http://localhost:3000` e a API em `http://localhost:3333`.
