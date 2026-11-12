<!-- README.md -->

# 🧠 PSI Tracker

Aplicação pessoal para acompanhar a terapia, com cinco frentes conectadas:

| Frente | O que faz |
| --- | --- |
| 📅 **Diário** | Calendário com humor, período menstrual e se tomou os remédios no dia |
| 🗓️ **Sessões** | Datas das sessões com status: realizada, a realizar, reagendada |
| 💰 **Financeiro** | Pacotes de R$ 900 com baixa de R$ 225 a cada sessão **realizada** |
| 📓 **Caderno** | Anotações estilo Notion, que podem ser ligadas a uma sessão |
| 🙂 **Meu perfil** | Nome, idade, peso, gênero, remédios e transtornos (investigados/comprovados) |

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + React Router + React Query
- **Backend:** Node.js 22 + Express 5 + TypeScript + Zod
- **Banco e login:** Supabase (Postgres 17 + Supabase Auth)
- **Ambiente:** Docker + Docker Compose

---

## 🐳 Docker em 2 minutos (para quem nunca usou)

Pense no Docker como uma forma de rodar programas dentro de **"caixinhas" isoladas**.

- **Imagem** = a receita da caixinha (o que instalar, que comando rodar). Fica no `Dockerfile`.
- **Container** = a caixinha rodando, criada a partir da imagem.
- **Docker Compose** = um arquivo (`docker-compose.yml`) que liga várias caixinhas de uma vez.

Por que isso ajuda? Você não precisa instalar Postgres nem configurar nada na mão:
o projeto roda igual em qualquer computador. Se algo quebrar, é só apagar a caixinha e criar outra.

Neste projeto, rodam estas caixinhas:

```
Seu navegador
     │
     ├──► web  (React)     http://localhost:5173   ┐ docker compose
     │       │                                      │ (npm run dev)
     │       ▼                                      │
     ├──► api  (Express)   http://localhost:3333   ┘
     │       │
     │       ▼
     └──► Supabase         http://localhost:54321  ┐ CLI do Supabase
             └ Postgres     porta 54322             │ (npm run db:start)
          Supabase Studio   http://localhost:54323  ┘ ← painel visual do banco
```

---

## ✅ Pré-requisitos (instalar uma única vez)

1. **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** — no Windows, aceite usar o **WSL 2** quando ele pedir. Depois de instalar, abra o Docker Desktop e espere aparecer "Engine running".
2. **[Node.js 22 LTS](https://nodejs.org/)** — usado para rodar a CLI do Supabase e o Prettier.
3. **[Git](https://git-scm.com/)**.

Confira no terminal:

```bash
docker --version
docker compose version
node --version   # deve começar com v22
```

## 🚀 Rodando pela primeira vez

```bash
# 1. Instale as ferramentas da raiz (CLI do Supabase e Prettier)
npm install

# 2. Suba o Supabase. Na primeira vez demora (baixa as imagens).
#    Ele aplica automaticamente as migrations da pasta supabase/migrations.
npm run db:start

# 3. Crie seu .env a partir do exemplo
cp .env.example .env          # no PowerShell: Copy-Item .env.example .env
#    Abra o .env e cole a "Publishable key" que apareceu no passo 2
#    (para ver de novo: npm run db:status)

# 4. Suba o frontend e a API
npm run dev
```

Pronto! Acesse:

- **App:** http://localhost:5173 → clique em "Ainda não tenho conta" e cadastre-se
- **API:** http://localhost:3333/api/health
- **Supabase Studio (ver as tabelas):** http://localhost:54323

> Em ambiente local o Supabase não envia e-mail de confirmação: o cadastro já entra direto.

## 🧰 Comandos do dia a dia

| Comando | O que faz |
| --- | --- |
| `npm run db:start` | Liga o Supabase |
| `npm run db:stop` | Desliga o Supabase (os dados continuam salvos) |
| `npm run db:status` | Mostra URLs e chaves do Supabase |
| `npm run db:reset` | ⚠️ Apaga o banco local e recria rodando todas as migrations + `seed.sql` |
| `npm run db:new-migration nome_da_mudanca` | Cria um arquivo novo de migration |
| `npm run dev` | Sobe web + api (Ctrl+C para parar) |
| `npm run dev:down` | Remove os containers web + api |
| `npm run dev:logs` | Acompanha os logs |
| `npm run format` | Formata todo o código com Prettier |

**Hot reload:** salvou um arquivo em `apps/*/src`, a tela/API atualiza sozinha.
**Instalou uma dependência nova** (mudou um `package.json`)? Rode `npm run dev` de novo — o `--build` recria a imagem.

## 📁 Estrutura de pastas

```
psi-tracker/
├── apps/
│   ├── api/                         # Backend (Express + TS)
│   │   └── src/
│   │       ├── config/              # Variáveis de ambiente validadas
│   │       ├── infra/               # Integrações externas (Supabase)
│   │       ├── shared/              # Erros, middlewares e tipos reutilizáveis
│   │       ├── modules/             # Uma pasta por frente do sistema
│   │       │   └── patient-profile/
│   │       │       ├── *.routes.ts      # URLs do módulo
│   │       │       ├── *.controller.ts  # HTTP: entrada e saída
│   │       │       ├── *.service.ts     # Regras de negócio
│   │       │       ├── *.repository.ts  # Acesso ao banco
│   │       │       ├── *.schemas.ts     # Validação (Zod)
│   │       │       └── *.types.ts
│   │       ├── routes.ts            # Registra todos os módulos
│   │       ├── app.ts               # Monta o Express
│   │       └── server.ts            # Sobe o servidor
│   └── web/                         # Frontend (React + TS)
│       └── src/
│           ├── app/                 # Rotas e provedores globais
│           ├── features/            # Uma pasta por frente (auth, perfil, sessões...)
│           │   └── patient-profile/
│           │       ├── api/         # Chamadas à API
│           │       ├── hooks/       # React Query
│           │       ├── pages/       # Telas
│           │       └── types.ts
│           ├── shared/              # Componentes, libs e config reutilizáveis
│           └── styles/
├── supabase/
│   ├── config.toml                  # Configuração do Supabase local
│   ├── migrations/                  # Histórico de mudanças do banco (SQL)
│   └── seed.sql                     # Dados de exemplo
├── docker-compose.yml
└── .env.example
```

**Regra de ouro do backend:** `routes → controller → service → repository → banco`.
Cada camada só conhece a de baixo. O módulo `patient-profile` é o modelo a ser copiado nas próximas frentes.

## 🔗 Como as frentes se conectam (banco)

```
auth.users ─┬─ patient_profiles   (criado automaticamente no cadastro)
            ├─ medications ─── medication_intakes   (tomei/não tomei, por dia)
            ├─ diagnoses                             (status: em investigação / comprovado / descartado)
            ├─ session_packages ─── therapy_sessions ─── notebook_pages
            │        └── view session_package_balances (saldo: só sessões "completed" dão baixa)
            └─ daily_logs                            (humor + menstruação, por dia)
```

Valores em dinheiro são salvos em **centavos** (`90000` = R$ 900,00) para evitar erro de arredondamento.
Todas as tabelas têm **Row Level Security**: cada usuário só acessa os próprios dados.

## 🆘 Problemas comuns

- **`Cannot connect to the Docker daemon`** → abra o Docker Desktop e espere ele iniciar.
- **`Defina SUPABASE_PUBLISHABLE_KEY no arquivo .env`** → você esqueceu o passo 3.
- **Porta em uso (`port is already allocated`)** → algum programa já usa 5173/3333/543xx. Feche-o ou rode `npm run dev:down`.
- **A API não conecta no Supabase** → confira se `npm run db:start` está rodando (`npm run db:status`).

## 🤝 Contribuindo

Veja o fluxo de branches e o padrão de commits em [CONTRIBUTING.md](./CONTRIBUTING.md).
