// 📚 Dicas completas sobre os recursos usados neste arquivo: docs/PLAYWRIGHT_TIPS.md
import { test, expect } from '@playwright/test'



test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const taskName = 'Ler um livro de qualidade'
  // 💡 DICA 1 — Fixture `request`: faz chamadas HTTP direto na API sem abrir browser.
  // Usado aqui para garantir que o teste começa sem dados residuais (idempotência).
  await request.delete('http://localhost:3333/helper/tasks/' + taskName)

  await page.goto('http://localhost:8080')

  // 💡 DICA 2 — Seletor com `*=`: localiza o input que contenha "InputNewTask" em
  // qualquer parte da classe CSS — útil quando o framework gera classes com hash dinâmico.
  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(taskName)

  // 💡 DICA 3 — Seletor de texto com `>> text=`: combina CSS + texto sem usar XPath.
  // Alternativa XPath (mais verbosa): page.click('//button[contains(text(),"Create")]')
  await page.click('css=button >> text=Create')

  // 💡 DICA 4 — Encadeando CSS com filtro de texto para localizar um item específico
  // dentro de um componente de lista (.task-item).
  const target = page.locator(`css=.task-item p >> text=${taskName}`)
  await expect(target).toBeVisible()
})

test.only('não deve permitir cadastrar uma tarefa com mesmo nome', async ({ page, request }) => {

  const task = {
    name: 'Ler um livro de qualidade',
    is_done: false
  }

  await request.delete('http://localhost:3333/helper/tasks/' + task.name)

  const newTask = await request.post('http://localhost:3333/tasks', {data: task})
  expect(newTask.ok()).toBeTruthy()

  await page.goto('http://localhost:8080')

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(task.name)
  await page.click('css=button >> text=Create')

  const target = page.locator('.swal2-html-container')
  await expect(target).toHaveText('Task already exists!')
  //await expect(alert).toHaveText('Task already exists')
})