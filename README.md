# 🎭 PlaywrightXpress — Automação de Testes End-to-End

Projeto de automação de testes **E2E** com [Playwright](https://playwright.dev/) para uma aplicação de gerenciamento de tarefas (To-Do List).  
Cobre cenários de **interface web** e **API REST**, com banco de dados SQLite, seguindo o padrão **Page Object Model (POM)**.

---

## 📌 Visão Geral

```
Frontend (porta 8080) ──► Playwright (testes E2E + API)
                                    │
                          API REST (porta 3333)
                                    │
                              SQLite (local)
```

Os testes interagem com o frontend via browser e com a API diretamente para setup/teardown de dados — garantindo testes **isolados e idempotentes**.

---

## 🗂️ Estrutura do Projeto

```
playwright-mark/
├── apps/
│   ├── api/                      → Backend Node.js + Express + TypeORM + SQLite
│   └── web/                      → Frontend estático (HTML/CSS/JS)
├── tests/
│   ├── home.spec.ts              → Teste de sanidade (app online)
│   ├── tasks.spec.ts             → Testes funcionais de tarefas
│   ├── fixtures/
│   │   └── task.model.ts         → Interface TaskModel
│   └── support/
│       ├── helpers.ts            → Funções de API (POST/DELETE via request)
│       └── pages/tasks/index.ts  → Page Object da tela de tarefas
├── docs/
│   └── PLAYWRIGHT_TIPS.md        → Dicas e referências dos recursos usados
├── playwright.config.ts
└── package.json
```

---

## 🚀 Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | v18+          |
| Yarn       | v1.22+        |
| NPM        | v9+           |

---

## ⚙️ Instalação — Passo a Passo

### 1. Instalar dependências da raiz (Playwright)

```bash
npm install
npx playwright install
```

### 2. Instalar dependências da API

```bash
cd apps/api
yarn install
```

### 3. Inicializar o banco de dados

```bash
yarn db:init
```

> Executa as migrations do TypeORM criando as tabelas necessárias no SQLite.

---

## ▶️ Subindo a Aplicação

Os testes dependem de **dois serviços rodando ao mesmo tempo**. Abra dois terminais:

**Terminal 1 — API (porta 3333)**

```bash
cd apps/api
yarn dev
```

**Terminal 2 — Frontend (porta 8080)**

```bash
npx serve apps/web -p 8080
```

> Após subir os dois serviços, você já pode executar os testes.

---

## 🧪 Executando os Testes

| Objetivo | Comando |
|----------|---------|
| Rodar todos os testes | `npx playwright test` |
| Rodar um arquivo específico | `npx playwright test tests/tasks.spec.ts` |
| Modo visual (UI Mode) | `npx playwright test --ui` |
| Ver relatório HTML | `npx playwright show-report` |

---

## 📋 Casos de Teste

### `home.spec.ts`

| Cenário | Descrição |
|---------|-----------|
| App deve estar online | Verifica se a aplicação carrega corretamente na porta 8080 |

### `tasks.spec.ts`

| Cenário | Descrição |
|---------|-----------|
| Deve cadastrar uma nova tarefa | Preenche o campo, clica em *Create* e valida que a tarefa aparece na lista |
| Não deve permitir tarefa duplicada | Tenta cadastrar uma tarefa com nome já existente e valida a mensagem de erro |

---

## 🏗️ Padrões e Arquitetura dos Testes

### Page Object Model (POM)

A classe `TasksPage` encapsula todas as interações com a tela de tarefas:

```typescript
const tasksPage = new TasksPage(page)
await tasksPage.go()          // navega para a página
await tasksPage.create(task)  // preenche e submete o formulário
await tasksPage.shouldHaveText(task.name)  // valida resultado
```

### Setup via API (fixture `request`)

Antes de cada teste, o estado do banco é controlado diretamente via API — sem depender da UI para preparar dados:

```typescript
await deleteTaskByHelper(request, task.name) // limpa o banco
await postTask(request, task)                // insere dado de teste
```

---

## 💡 Dicas de Playwright

As técnicas usadas neste projeto estão documentadas em detalhes:

📄 **[docs/PLAYWRIGHT_TIPS.md](docs/PLAYWRIGHT_TIPS.md)**

Tópicos cobertos:
- Fixture `request` para chamadas HTTP sem abrir o browser
- Seletor `*=` para classes CSS com hash dinâmico
- Seletor `>> text=` combinando CSS e texto
- Boas práticas de isolamento de testes

---

## 🔧 Scripts Disponíveis

### Raiz do projeto

| Comando | Descrição |
|---------|-----------|
| `npx playwright test` | Executa todos os testes |
| `npx playwright test --ui` | Abre o Playwright UI Mode |
| `npx playwright show-report` | Abre o relatório HTML |

### `apps/api`

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Inicia a API em modo desenvolvimento |
| `yarn db:init` | Roda as migrations (cria tabelas) |
| `yarn db:drop` | Remove o schema do banco |

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| Testes E2E | Playwright 1.59+ |
| Dados de teste | Faker.js 10+ |
| Backend | Node.js + Express |
| ORM | TypeORM 0.2 |
| Banco de dados | SQLite (better-sqlite3 11+) |
| Frontend | HTML/CSS/JS estático |

---

## ⚠️ Atenção — Node.js v24+

Se estiver usando **Node.js v24 ou superior**, use `better-sqlite3@11+`. Versões anteriores não compilam por exigência de C++20 nos headers do V8.

```bash
# Dentro de apps/api
npm install better-sqlite3@11.10.0 --save
```

---

## 👤 Contato

Dúvidas, sugestões ou colaborações? Me encontre no LinkedIn:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Gabriel%20Roquim-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabsqa/)
