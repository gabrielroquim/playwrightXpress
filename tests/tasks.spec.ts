// 📚 Dicas completas sobre os recursos usados neste arquivo: docs/PLAYWRIGHT_TIPS.md
import { test, expect } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks/index'


test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const task: TaskModel = {
    name: 'Ler um livro de testes de software',
    is_done: false
  }

  await deleteTaskByHelper(request, task.name)

  const tasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.create(task)

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

  const tasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.create(task)

  const target = page.locator('.swal2-html-container')
  await expect(target).toHaveText('Task already exists!')
  //await expect(alert).toHaveText('Task already exists')
})