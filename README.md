# 🎭 PlaywrightXpress — Automação de Testes End-to-End

Projeto de automação de testes E2E com **Playwright** para uma aplicação de gerenciamento de tarefas (To-Do), cobrindo interface web e API REST com banco de dados SQLite.

---

## 🗂️ Estrutura do Projeto

```
playwright-mark/
├── apps/
│   ├── api/          → Backend Node.js + Express + TypeORM + SQLite
│   └── web/          → Frontend estático (HTML/CSS/JS)
├── tests/
│   ├── home.spec.ts  → Teste de sanidade (app online)
│   └── tasks.spec.ts → Testes funcionais de tarefas
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

## ⚙️ Configuração e Instalação

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

## ▶️ Executando a Aplicação

Antes de rodar os testes, **ambos os serviços precisam estar no ar**:

### API (porta 3333)

```bash
cd apps/api
yarn dev
```

### Web (porta 8080)

Sirva a pasta `apps/web/` com qualquer servidor estático, por exemplo:

```bash
npx serve apps/web -p 8080
```

---

## 🧪 Executando os Testes

### Rodar todos os testes

```bash
npx playwright test
```

### Rodar um arquivo específico

```bash
npx playwright test tests/tasks.spec.ts
```

### Rodar com interface visual (UI Mode)

```bash
npx playwright test --ui
```

### Gerar e abrir relatório HTML

```bash
npx playwright show-report
```

---

## 📋 Casos de Teste

### `home.spec.ts`
| Teste | Descrição |
|-------|-----------|
| app deve estar online | Verifica se a aplicação carrega na porta 8080 |

### `tasks.spec.ts`
| Teste | Descrição |
|-------|-----------|
| deve poder cadastrar uma nova tarefa | Preenche o campo, clica em Create e valida que a tarefa aparece na lista |

---

## 💡 Dicas de Playwright

As dicas e aprendizados sobre os recursos usados nos testes estão documentadas em:

📄 **[docs/PLAYWRIGHT_TIPS.md](docs/PLAYWRIGHT_TIPS.md)**

Tópicos cobertos: seletores `*=`, `>> text=`, fixture `request`, Faker.js, rotas de helper por ambiente e boas práticas gerais.

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
|--------|-----------|
| Testes E2E | Playwright 1.59+ |
| Dados de teste | Faker.js 10+ |
| Backend | Node.js + Express |
| ORM | TypeORM 0.2 |
| Banco de dados | SQLite (better-sqlite3 11+) |
| Frontend | HTML/CSS/JS estático |

---

## ⚠️ Observação sobre Node.js v24+

Se estiver usando **Node.js v24 ou superior**, certifique-se de usar `better-sqlite3@11+`. Versões anteriores (9.x) não compilam por exigência de C++20 nos headers do V8.

```bash
# Dentro de apps/api
npm install better-sqlite3@11.10.0 --save
```
