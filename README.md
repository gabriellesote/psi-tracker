<!-- README.md -->

# 🧠 PSI Tracker

Aplicação pessoal para acompanhar a terapia, com **site (desktop)** e **app (celular)**
sincronizados em tempo real, e cinco frentes conectadas:

| Frente | O que faz |
| --- | --- |
| 📅 **Diário** | Calendário com humor, período menstrual e se tomou os remédios no dia |
| 🗓️ **Sessões** | Datas das sessões com status: realizada, a realizar, reagendada |
| 💰 **Financeiro** | Pacotes de R$ 900 com baixa de R$ 225 a cada sessão **realizada** |
| 📓 **Caderno** | Anotações estilo Notion, que podem ser ligadas a uma sessão |
| 🙂 **Meu perfil** | Nome, idade, peso, gênero, remédios e transtornos (investigados/comprovados) |

## Stack

- **Site:** React 19 + TypeScript + Vite + Tailwind CSS + React Router + React Query
- **App:** Expo (React Native) + Expo Router + React Query
- **API:** Node.js 22 + Express 5 + TypeScript + Zod
- **Banco, login e tempo real:** Supabase (Postgres 17 + Auth com Google + Realtime)
- **Código compartilhado:** pacote `@psi-tracker/shared` (tipos, validações, cliente da API, sincronização e cores)
- **Ambiente:** Docker + Docker Compose, monorepo com npm workspaces

---

## 🔄 Como site e app ficam sincronizados

```
  📱 App (Expo)                              💻 Site (React)
      │  salva o perfil                           ▲
      ▼                                           │ 3. recarrega só as telas afetadas
  API (Express) ──► Postgres (Supabase)           │
                         │                        │
                         └─ 2. Realtime avisa ────┘  (e avisa o app também, se a mudança veio do site)
```

1. Qualquer alteração passa pela API e é gravada no banco.
2. O **Supabase Realtime** avisa, na hora, todos os aparelhos logados na mesma conta.
3. Site e app recarregam só o que mudou (o mapa "tabela → telas" fica em `packages/shared/src/data-sync`).

Como rede de segurança, os dados também são conferidos quando você volta para a aba do navegador ou reabre o app.

**Login uma vez só:** a sessão fica salva no navegador e no celular, e o token é renovado
automaticamente. Você só sai quando clicar em "Sair".

---

## 🐳 Docker em 2 minutos (para quem nunca usou)

Pense no Docker como uma forma de rodar programas dentro de **"caixinhas" isoladas**.

- **Imagem** = a receita da caixinha (o que instalar, que comando rodar). Fica no `Dockerfile`.
- **Container** = a caixinha rodando, criada a partir da imagem.
- **Docker Compose** = um arquivo (`docker-compose.yml`) que liga várias caixinhas de uma vez.

```
Seu navegador / celular
     │
     ├──► web  (React)     http://localhost:5173   ┐ docker compose
     ├──► api  (Express)   http://localhost:3333   ┘ (npm run dev)
     │
     ├──► Supabase         http://localhost:54321  ┐ CLI do Supabase
     │      └ Postgres      porta 54322             │ (npm run db:start)
     │    Supabase Studio  http://localhost:54323  ┘ ← painel visual do banco
     │
     └──► Expo (app)       porta 8081               ← roda fora do Docker (npm run mobile)
```

---

## ✅ Pré-requisitos (instalar uma única vez)

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** (no Windows, com WSL 2).
2. **[Node.js 22 LTS](https://nodejs.org/)** ou mais novo.
3. **[Git](https://git-scm.com/)**.
4. No celular: o app **Expo Go** (Play Store / App Store).

## 🚀 Rodando pela primeira vez

```bash
# 1. Instale as dependências de todo o monorepo (site, app, API e shared)
npm install

# 2. Crie seu .env a partir do exemplo
cp .env.example .env          # no PowerShell: Copy-Item .env.example .env
#    Preencha as chaves do Google (seção "Login com Google" abaixo)

# 3. Suba o Supabase (aplica as migrations da pasta supabase/migrations)
npm run db:start
#    Copie a "Publishable" key que aparecer para o .env

# 4. Suba o site e a API
npm run dev
```

Pronto! Acesse **http://localhost:5173** e clique em **Continuar com Google**.

## 🔐 Login com Google (configuração única)

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) e crie um projeto chamado **PSI Tracker**.
2. Vá em **APIs e serviços → Tela de consentimento OAuth** (ou "Google Auth Platform"):
   - Tipo de usuário: **Externo**; nome do app: **PSI Tracker**; e-mail de suporte: o seu.
   - Em **Público / Usuários de teste**, adicione o **seu e-mail do Google**.
3. Vá em **Credenciais → Criar credenciais → ID do cliente OAuth**:
   - Tipo: **Aplicativo da Web**
   - **Origens JavaScript autorizadas:** `http://localhost:5173`
   - **URIs de redirecionamento autorizados:** `http://127.0.0.1:54321/auth/v1/callback`
4. Copie o **ID do cliente** e a **Chave secreta** para o `.env`:
   ```
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=...
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=...
   ```
5. Reinicie o Supabase para ele ler as chaves: `npm run db:stop` e depois `npm run db:start`.

## 📱 Rodando o app no celular

1. Descubra o IP do computador: no PowerShell, `ipconfig` → **Endereço IPv4** (ex.: `192.168.0.15`).
2. Crie `apps/mobile/.env` a partir de `apps/mobile/.env.example` e troque `SEU_IP_LOCAL` pelo IP.
3. Celular e computador precisam estar **no mesmo Wi-Fi**.
4. Com o Supabase e o `npm run dev` rodando, abra outro terminal:
   ```bash
   npm run mobile
   ```
5. Leia o QR code: no Android, pelo **Expo Go**; no iPhone, pela **câmera**.
6. Se o Windows perguntar sobre o **Firewall**, permita o acesso em **redes privadas**.

> ⚠️ **Login no celular durante o desenvolvimento:** o Google só aceita voltar para `localhost`
> ou para endereços `https`, então o login com Google no celular só funciona quando o projeto
> estiver publicado (Supabase na nuvem). Até lá, use o **"Só no desenvolvimento: entrar com e-mail"**:
> crie a conta pelo site (mesmo formulário) e entre com ela no site e no app para testar a sincronização.

## 🧰 Comandos do dia a dia

| Comando | O que faz |
| --- | --- |
| `npm run db:start` / `db:stop` | Liga / desliga o Supabase (os dados continuam salvos) |
| `npm run db:status` | Mostra URLs e chaves do Supabase |
| `npm run db:reset` | ⚠️ Apaga o banco local e recria rodando todas as migrations + `seed.sql` |
| `npm run db:new-migration nome` | Cria um arquivo novo de migration |
| `npm run dev` | Sobe site + API no Docker (Ctrl+C para parar) |
| `npm run dev:down` / `dev:logs` | Remove os containers / acompanha os logs |
| `npm run mobile` | Sobe o app (Expo) para abrir no celular |
| `npm run typecheck` | Confere os tipos de todos os pacotes |
| `npm run lint` | Confere o padrão de código de todos os pacotes |
| `npm run format` | Formata todo o código com Prettier |

**Hot reload:** salvou um arquivo em `apps/*/src` ou `packages/shared/src`, a tela/API atualiza sozinha.
**Instalou uma dependência nova?** Rode `npm install` na raiz e `npm run dev` de novo (o `--build` recria as imagens).
No app, sempre instale pacotes com `npx expo install <pacote>` dentro de `apps/mobile` (garante a versão compatível).

## 📁 Estrutura de pastas (monorepo)

```
psi-tracker/
├── apps/
│   ├── api/                  # Backend (Express + TS)
│   │   └── src/
│   │       ├── config/       # Variáveis de ambiente validadas
│   │       ├── infra/        # Integrações externas (Supabase)
│   │       ├── shared/       # Erros, middlewares e tipos reutilizáveis
│   │       └── modules/      # Uma pasta por frente: routes → controller → service → repository
│   ├── web/                  # Site (React + Vite)
│   │   └── src/
│   │       ├── app/          # Rotas e provedores globais
│   │       ├── features/     # Uma pasta por frente (auth, perfil, sessões...)
│   │       ├── shared/       # Componentes, hooks, libs e tema
│   │       └── styles/
│   └── mobile/               # App (Expo + Expo Router)
│       └── src/
│           ├── app/          # Rotas: cada arquivo é uma tela (abas em (tabs)/)
│           ├── features/     # Uma pasta por frente (mesma divisão do site)
│           └── shared/       # Componentes, hooks, libs e tema
├── packages/
│   └── shared/               # Código usado pelos 3 apps
│       └── src/
│           ├── api/          # Cliente da API (site e app usam o mesmo)
│           ├── data-sync/    # Chaves de cache + sincronização em tempo real
│           ├── design/       # Design tokens: cores, cantos, espaçamentos, fonte
│           ├── money/        # Formatação de dinheiro (centavos → R$)
│           └── patient-profile/  # Tipos e validações do perfil
├── supabase/
│   ├── config.toml           # Configuração do Supabase local (inclui login com Google)
│   ├── migrations/           # Histórico de mudanças do banco (SQL)
│   └── seed.sql
├── docker-compose.yml
└── .env.example
```

**Regra de ouro:** se algo é usado por mais de um app (tipo, validação, regra, cor), ele mora em `packages/shared`.

## 🔗 Como as frentes se conectam (banco)

```
auth.users ─┬─ patient_profiles   (criado automaticamente no cadastro)
            ├─ medications ─── medication_intakes   (tomei/não tomei, por dia)
            ├─ diagnoses                             (em investigação / comprovado / descartado)
            ├─ session_packages ─── therapy_sessions ─── notebook_pages
            │        └── view session_package_balances (saldo: só sessões "completed" dão baixa)
            └─ daily_logs                            (humor + menstruação, por dia)
```

Valores em dinheiro são salvos em **centavos** (`90000` = R$ 900,00).
Todas as tabelas têm **Row Level Security** (cada usuário só acessa os próprios dados) e estão no **Realtime**.

## 🆘 Problemas comuns

- **`Cannot connect to the Docker daemon`** → abra o Docker Desktop e espere ele iniciar.
- **`Defina SUPABASE_PUBLISHABLE_KEY no arquivo .env`** → falta preencher o `.env` da raiz.
- **Erro do Google `redirect_uri_mismatch`** → confira a URI `http://127.0.0.1:54321/auth/v1/callback` no Google Cloud.
- **Google diz "acesso bloqueado / app não verificado"** → adicione seu e-mail em **Usuários de teste**.
- **App no celular não carrega / "Network request failed"** → confira o IP em `apps/mobile/.env`, o mesmo Wi-Fi e o Firewall do Windows.
- **Porta em uso (`port is already allocated`)** → feche o programa que usa 5173/3333/543xx ou rode `npm run dev:down`.

## 📜 Histórico de evolução

Cada tela ou melhoria nasce numa branch `feature/...`, entra no `develop` por Pull Request
e só chega ao `main` depois de testada. Ao fechar uma feature, adicione uma linha aqui.

| Versão / Branch | O que entrou |
| --- | --- |
| `chore: commit inicial` | Estrutura base: React + Express + Supabase + Docker, schema do banco com RLS e tela de perfil |
| `feature/app-mobile-login-google-sincronizacao` | Monorepo com pacote `shared`, app Expo, login com Google com sessão persistente, sincronização em tempo real e design tokens |

## 🤝 Contribuindo

Veja o fluxo de branches e o padrão de commits em [CONTRIBUTING.md](./CONTRIBUTING.md).
