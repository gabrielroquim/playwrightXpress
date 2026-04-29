# 🎭 PlaywrightXpress — Automação de Testes End-to-End

[![Playwright](https://img.shields.io/badge/Playwright-1.59+-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

> 📚 Projeto desenvolvido durante o curso **[Playwright eXpress](https://www.udemy.com/course/playwright-express/)** — instrutor **Fernando Papito**

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
│   │   ├── task.model.ts         → Interface TaskModel
│   │   └── tasks.json            → Massa de dados dos testes
│   └── support/
│       ├── helpers.ts            → Funções de API (POST/DELETE via request)
│       └── pages/tasks/index.ts  → Page Object da tela de tarefas
├── docs/
│   └── PLAYWRIGHT_TIPS.md        → Dicas e referências dos recursos usados
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | v18+          |
| Yarn       | v1.22+        |

---

## ⚙️ Instalação — Passo a Passo

### 1. Instalar dependências da raiz (Playwright)

```bash
yarn install
yarn playwright install
```

### 2. Instalar dependências da API

```bash
cd apps/api
yarn install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
BASE_URL=http://localhost:8080
BASE_API=http://localhost:3333
```

### 4. Inicializar o banco de dados

```bash
cd apps/api
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
| Rodar todos os testes | `yarn playwright test` |
| Rodar um arquivo específico | `yarn playwright test tests/tasks.spec.ts` |
| Rodar apenas Chromium | `yarn playwright test --project=chromium` |
| Modo visual (UI Mode) | `yarn playwright test --ui` |
| Ver relatório HTML | `yarn playwright show-report` |

---

## 📋 Casos de Teste

### `home.spec.ts`

| Cenário | Descrição |
|---------|-----------|
| App deve estar online | Verifica se a aplicação carrega corretamente na porta 8080 |

### `tasks.spec.ts`

| Suite | Cenário | Descrição |
|-------|---------|-----------|
| Cadastro | Deve cadastrar uma nova tarefa | Preenche o campo, clica em *Create* e valida que a tarefa aparece na lista |
| Cadastro | Não deve permitir tarefa duplicada | Tenta cadastrar tarefa com nome já existente e valida a mensagem de erro |
| Cadastro | Campo obrigatório | Tenta submeter sem nome e valida a mensagem de validação nativa do browser |
| Atualização | Deve marcar uma tarefa como concluída | Clica no toggle e valida o estilo `line-through` no nome da tarefa |
| Deleção | Deve deletar uma tarefa | Clica em remover e valida que a tarefa não existe mais na lista |

---

## 🏗️ Padrões e Arquitetura dos Testes

### Page Object Model (POM)

A classe `TasksPage` encapsula todas as interações com a tela de tarefas:

```typescript
const tasksPage = new TasksPage(page)
await tasksPage.go()                        // navega para a página
await tasksPage.create(task)               // preenche e submete o formulário
await tasksPage.shouldHaveText(task.name)  // valida que a tarefa foi criada
await tasksPage.toggle(task.name)          // marca como concluída
await tasksPage.shouldBeDone(task.name)    // valida estilo line-through
await tasksPage.remove(task.name)          // deleta a tarefa
await tasksPage.shouldNotExist(task.name)  // valida que foi removida
```

### Setup via API (fixture `request`)

Antes de cada teste, o estado do banco é controlado diretamente via API — sem depender da UI para preparar dados:

```typescript
await deleteTaskByHelper(request, task.name) // garante estado limpo
await postTask(request, task)                // insere pré-condição
```

### Massa de Dados (`tasks.json`)

Os dados de teste são centralizados em `tests/fixtures/tasks.json`, separados por cenário:

```json
{
  "success":   { "name": "...", "is_done": false },
  "duplicate": { "name": "...", "is_done": false },
  "required":  { "name": "",   "is_done": false },
  "update":    { "name": "...", "is_done": false },
  "delete":    { "name": "...", "is_done": false }
}
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
| `yarn playwright test` | Executa todos os testes |
| `yarn playwright test --ui` | Abre o Playwright UI Mode |
| `yarn playwright show-report` | Abre o relatório HTML |
| `yarn playwright install` | Instala os browsers do Playwright |

### `apps/api`

| Comando | Descrição |
|---------|-----------|
| `yarn dev` | Inicia a API em modo desenvolvimento |
| `yarn db:init` | Roda as migrations (cria tabelas) |
| `yarn db:drop` | Remove o schema do banco |

---

## 🛠️ Stack Tecnológica

### Linguagens & Ferramentas

<p align="left">
  <img src="https://skillicons.dev/icons?i=ts,nodejs,express,sqlite,git" alt="TypeScript, Node.js, Express, SQLite, Git" height="40"/>
  <img src="https://img.shields.io/badge/⠀-2EAD33?logo=playwright&logoColor=white&style=flat-square" alt="Playwright" title="Playwright" height="40"/>
</p>

| Camada | Tecnologia |
|--------|------------|
| Testes E2E | Playwright 1.59+ |
| Linguagem de testes | TypeScript 5+ |
| Variáveis de ambiente | dotenv 17+ |
| Backend | Node.js + Express 4 |
| ORM | TypeORM 0.2 |
| Banco de dados | SQLite (better-sqlite3 11+) |
| Frontend | HTML/CSS/JS estático |

---

## ⚠️ Atenção — Node.js v24+ e Windows Firewall

**Node.js v24+:** use `better-sqlite3@11+`. Versões anteriores não compilam por exigência de C++20.

```bash
# Dentro de apps/api
yarn add better-sqlite3@11.10.0
```

**Windows Firewall:** ao executar os testes pela primeira vez em Firefox ou WebKit, o Windows pode bloquear o acesso à rede. Caso isso ocorra, reinstale os browsers para que o popup apareça novamente:

```bash
yarn playwright install firefox webkit
```

---

## 👤 Contato

Dúvidas, sugestões ou colaborações? Me encontre no LinkedIn:

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Gabriel%20Roquim-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/gabsqa/)
