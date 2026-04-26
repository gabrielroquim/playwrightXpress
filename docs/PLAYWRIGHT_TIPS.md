# 💡 Playwright Tips — Aprendizados do Projeto

Referência das técnicas usadas nos testes deste repositório.  
Cada dica aponta para o arquivo onde o recurso é aplicado na prática.

---

## Dica 1 — Fixture `request`: chamadas HTTP sem abrir o browser

**Arquivo:** `tests/tasks.spec.ts`

O Playwright expõe o fixture `request` junto com `page`, permitindo fazer chamadas HTTP diretamente à API dentro do mesmo contexto do teste.

**Por que usar?**  
Para preparar ou limpar o estado do banco antes/depois do teste, sem depender da UI. Isso torna o teste **idempotente** — ele passa independente de quantas vezes for executado.

```typescript
test('deve cadastrar tarefa', async ({ page, request }) => {
  // Remove a tarefa do banco antes de começar, evitando falha por dado duplicado
  await request.delete('http://localhost:3333/helper/tasks/' + taskName)
})
```

> **Boas práticas:** use `request` para setup/teardown de dados. Nunca dependa de uma ordem de execução dos testes para que o estado do banco esteja correto.

---

## Dica 2 — Seletor com `*=`: parte do nome da classe CSS

**Arquivo:** `tests/tasks.spec.ts`

O operador `*=` dentro de colchetes seleciona um elemento onde o atributo **contém** o valor informado em qualquer posição.

**Por que usar?**  
Frameworks modernos (React, Vue, Angular) frequentemente geram classes com sufixos de hash dinâmico, como `InputNewTask_abc123`. O `*=` garante que o seletor continuará funcionando mesmo se o hash mudar.

```typescript
// ✅ Robusto — funciona com qualquer hash gerado pelo build
const input = page.locator('input[class*=InputNewTask]')

// ❌ Frágil — quebra se o hash mudar
const input = page.locator('input[class="InputNewTask_abc123"]')
```

> **Outros operadores úteis:**
> - `^=` → começa com o valor
> - `$=` → termina com o valor
> - `*=` → contém o valor (mais flexível)

---

## Dica 3 — Seletor de texto com `>> text=`: adeus XPath verboso

**Arquivo:** `tests/tasks.spec.ts`

O Playwright permite combinar um seletor CSS com um filtro de texto usando `>>`. É mais legível e menos frágil do que XPath.

```typescript
// ✅ Playwright — conciso e legível
await page.click('css=button >> text=Create')

// ❌ XPath equivalente — mais verboso
await page.click('//button[contains(text(),"Create")]')
```

> **Quando preferir `getByRole` (abordagem mais moderna):**
> ```typescript
> await page.getByRole('button', { name: 'Create' }).click()
> ```
> O `getByRole` é o seletor recomendado pelo Playwright por seguir padrões de acessibilidade (ARIA). Reserve `>> text=` para casos onde o elemento não tem papel semântico bem definido.

---

## Dica 4 — Encadeando CSS + texto para itens de lista

**Arquivo:** `tests/tasks.spec.ts`

Combine um seletor de componente com filtro de texto para localizar um item **específico** dentro de uma lista dinâmica.

```typescript
// Localiza o <p> com o texto exato da tarefa, dentro de qualquer .task-item
const target = page.locator(`css=.task-item p >> text=${taskName}`)
await expect(target).toBeVisible()
```

> **Versão moderna equivalente:**
> ```typescript
> const target = page.locator('.task-item p').filter({ hasText: taskName })
> ```

---

## Dica 5 — Dados dinâmicos com Faker.js

**Instalado em:** `package.json` (devDependencies)

O `@faker-js/faker` gera dados aleatórios e realistas para os testes, evitando dependência de strings fixas que podem já existir no banco.

```typescript
import { faker } from '@faker-js/faker'

const taskName = faker.lorem.words(3)         // "lorem ipsum dolor"
const email    = faker.internet.email()        // "user@example.com"
const nome     = faker.person.fullName()       // "Ana Paula Silva"
```

> **Quando usar dado fixo vs. faker:**
> - **Fixo** → quando o teste valida um valor específico que precisa ser consultado/limpo via API (como neste projeto)
> - **Faker** → quando o dado só precisa ser único e válido, sem consulta posterior

---

## Dica 6 — Rotas de helper protegidas por ambiente

**Arquivo:** `apps/api/src/routes.js`

A API expõe endpoints destrutivos (`DELETE /helper/tasks`) **somente fora de produção**. Padrão essencial para evitar que testes apaguem dados reais.

```javascript
if (process.env.NODE_ENV !== 'production') {
  router.delete('/helper/tasks/:task_name', taskController.removeByName2)
}
```

> Configure `NODE_ENV=test` no ambiente de CI para garantir que as rotas de helper estejam disponíveis apenas nos pipelines de teste.

---

## Referências

- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Faker.js Docs](https://fakerjs.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
