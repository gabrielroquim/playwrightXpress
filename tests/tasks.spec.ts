// 📚 Dicas completas sobre os recursos usados neste arquivo: docs/PLAYWRIGHT_TIPS.md
import { expect, test, } from '@playwright/test'
import { TaskModel } from './fixtures/task.model'
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks/index'
import data from './fixtures/tasks.json'

let tasksPage: TasksPage

test.beforeEach(({ page }) => {
  tasksPage = new TasksPage(page)

})

test.describe('Cadastro de tarefas', () => {

  test('deve poder cadastrar uma nova tarefa', async ({ request }) => {
    const task = data.success as TaskModel

    await deleteTaskByHelper(request, task.name)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.shouldHaveText(task.name)

  })

  test('não deve permitir cadastrar uma tarefa com mesmo nome', async ({ request }) => {
    const task = data.duplicate as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.alertHaveText('Task already exists!')
  })

  test('campo obrigatório', async ({ page }) => {
    const task = data.required as TaskModel

    await tasksPage.go()
    await tasksPage.create(task)

    const validationMessage = await tasksPage.inputTaskName.evaluate((e => (e as HTMLInputElement).validationMessage))
    expect(validationMessage).toEqual('This is a required field')

  })
})

test.describe('atulização de tarefas', () => {
  test('deve marcar uma tarefa como concluída', async ({ request }) => {
    const task = data.update as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.toggle(task.name)
    await tasksPage.shouldBeDone(task.name)
  })
})

test.describe('delete de tarefas', () => {
  test('deve deletar uma tarefa', async ({ request }) => {
    const task = data.delete as TaskModel

    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    await tasksPage.go()
    await tasksPage.remove(task.name)
    await tasksPage.shouldNotExist(task.name)
  })
})