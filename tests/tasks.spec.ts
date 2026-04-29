// 📚 Dicas completas sobre os recursos usados neste arquivo: docs/PLAYWRIGHT_TIPS.md
import { expect, test, } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks/index'
import data from './fixtures/tasks.json'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const task = data.success as TaskModel

  await deleteTaskByHelper(request, task.name)

  const tasksPage: TasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.create(task)
  await tasksPage.shouldHaveText(task.name)

})

test('não deve permitir cadastrar uma tarefa com mesmo nome', async ({ page, request }) => {
  const task = data.duplicate as TaskModel

  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  const tasksPage: TasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.create(task)

  await tasksPage.alertHaveText('Task already exists!')
})

test('campo obrigatório', async ({ page }) => {
  const task = data.required as TaskModel

  const tasksPage: TasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.create(task)

  const validationMessage = await tasksPage.inputTaskName.evaluate((e => (e as HTMLInputElement).validationMessage))
  expect(validationMessage).toEqual('This is a required field')

})

test.only('deve marcar uma tarefa como concluída', async ({ page, request }) => {
  const task = data.update as TaskModel

  await deleteTaskByHelper(request, task.name)
  await postTask(request, task)

  const tasksPage: TasksPage = new TasksPage(page)
  await tasksPage.go()
  await tasksPage.toggle(task.name)
  await tasksPage.shouldBeDone(task.name)
})