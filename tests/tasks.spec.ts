// 📚 Dicas completas sobre os recursos usados neste arquivo: docs/PLAYWRIGHT_TIPS.md
import { test, expect} from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const task: TaskModel = {
    name: 'Ler um livro de testes de software',
    is_done: false
  }

  await deleteTaskByHelper(request, task.name)

  await page.goto('http://localhost:8080')

  // 💡 DICA 2 — Seletor com `*=`: localiza o input que contenha "InputNewTask" em
  // qualquer parte da classe CSS — útil quando o framework gera classes com hash dinâmico.
  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(task.name)

  // 💡 DICA 3 — Seletor de texto com `>> text=`: combina CSS + texto sem usar XPath.
  // Alternativa XPath (mais verbosa): page.click('//button[contains(text(),"Create")]')
  await page.click('css=button >> text=Create')

  // 💡 DICA 4 — Encadeando CSS com filtro de texto para localizar um item específico
  // dentro de um componente de lista (.task-item).
  const target = page.locator(`css=.task-item p >> text=${task.name}`)
  await expect(target).toBeVisible()
})

test('não deve permitir cadastrar uma tarefa com mesmo nome', async ({ page, request }) => {

  const task: TaskModel = {
    name: 'Ler um livro de qualidade',
    is_done: false
  }

  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  await page.goto('http://localhost:8080')

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(task.name)
  await page.click('css=button >> text=Create')

  const target = page.locator('.swal2-html-container')
  await expect(target).toHaveText('Task already exists!')
  //await expect(alert).toHaveText('Task already exists')
})