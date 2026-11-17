<!-- CONTRIBUTING.md -->

# Fluxo de trabalho

## Branches

| Branch | Para que serve |
| --- | --- |
| `main` | Versão **homologada** (estável). Nunca se commita direto nela. |
| `develop` | Onde as novidades são integradas e testadas. |
| `feature/<nome>` | Uma funcionalidade nova. Sai de `develop` e volta para `develop`. |
| `fix/<nome>` | Correção de bug. Sai de `develop` e volta para `develop`. |
| `hotfix/<nome>` | Correção urgente em produção. Sai de `main` e volta para `main` **e** `develop`. |

```
feature/financeiro ──┐
feature/caderno ─────┼──► develop ──(testado e homologado)──► main
fix/saldo-pacote ────┘
```

### Passo a passo de uma funcionalidade

```bash
git switch develop
git pull                                   # pega a versão mais nova
git switch -c feature/sessoes-crud         # cria sua branch

# ... programa, testa ...
git add .
git commit -m "feat(sessoes): adiciona cadastro de sessões"
git push -u origin feature/sessoes-crud
```

Depois, no GitHub, abra um **Pull Request** de `feature/sessoes-crud` → `develop`.
Quando `develop` estiver testada e aprovada, abra um Pull Request de `develop` → `main`.

## Uma feature por tela

Cada tela (ou melhoria grande) tem a sua própria branch, para abrir e fechar implementações
com facilidade e manter o histórico de evolução legível:

| Tela / melhoria | Nome da branch |
| --- | --- |
| Diário (calendário) | `feature/tela-diario` |
| Sessões | `feature/tela-sessoes` |
| Financeiro | `feature/tela-financeiro` |
| Caderno | `feature/tela-caderno` |
| Perfil (remédios e transtornos) | `feature/tela-perfil` |
| Ajuste visual geral | `feature/concept-design` |

Regras:

1. A branch sai sempre do `develop` atualizado.
2. **Cada alteração vira um commit** com mensagem clara (veja abaixo). Nada de "ajustes" genéricos.
3. Ao terminar, atualize o README (inclusive a tabela **Histórico de evolução**) no último commit da feature.
4. Abra o Pull Request para o `develop`. Depois de testado e aprovado, `develop` → `main`.

## Mensagens de commit (Conventional Commits)

Formato:

```
<tipo>(<escopo opcional>): <descrição no imperativo, em minúsculas>
```

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `feat` | Funcionalidade nova | `feat(financeiro): mostra saldo restante do pacote` |
| `fix` | Correção de bug | `fix(sessoes): corrige baixa duplicada em sessão reagendada` |
| `refactor` | Melhoria de código sem mudar comportamento | `refactor(api): extrai cálculo de idade para o service` |
| `style` | Visual/formatação, sem lógica | `style(web): ajusta espaçamento do menu lateral` |
| `docs` | Documentação | `docs: explica comandos do docker no readme` |
| `test` | Testes | `test(perfil): cobre cálculo de idade` |
| `chore` | Configuração, dependências, tarefas | `chore: atualiza versão do vite` |
| `feat(db)` / `fix(db)` | Migrations do banco | `feat(db): cria tabela de lembretes` |

Dicas:

- Um commit = uma mudança lógica. Evite "várias coisas" no mesmo commit.
- Escreva o que o commit **faz**: "adiciona", "corrige", "remove" — não "adicionei".
- Se precisar explicar o porquê, deixe uma linha em branco e escreva um corpo:

```
fix(financeiro): não desconta sessão reagendada do pacote

Sessões com status "rescheduled" estavam entrando na conta do saldo.
Agora só sessões "completed" dão baixa de R$ 225.
```

## Padrões de código

- Nomes descritivos: `remainingAmountCents`, não `rest` ou `x`.
- Todo arquivo de código começa com um comentário com o seu caminho.
- Backend: `routes → controller → service → repository`. Regra de negócio só no service.
- Frontend: código de uma frente fica em `src/features/<frente>`; o que é reutilizado vai para `src/shared`.
- Mudanças no banco **sempre** por migration (`npm run db:new-migration nome`), nunca editando pelo Studio.
- Código usado por mais de um app (tipos, validações, regras, cores) vai para `packages/shared`.
- No app (`apps/mobile`), instale pacotes com `npx expo install <pacote>`.
- Antes de commitar, na raiz: `npm run format`, `npm run lint` e `npm run typecheck`.
