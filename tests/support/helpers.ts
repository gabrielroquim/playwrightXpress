
import { expect, APIRequestContext } from '@playwright/test'
import { TaskModel } from '../fixtures/task.model'
import 'dotenv/config'

const BASE_API = process.env.BASE_API

async function deleteTaskByHelper(request: APIRequestContext, taskName: string) {
  await request.delete(`${BASE_API}/helper/tasks/${taskName}`)
}

async function postTask(request: APIRequestContext, task: TaskModel) {
  const newTask = await request.post(`${BASE_API}/tasks`, { data: task })
  expect(newTask.ok()).toBeTruthy()
}

export {
  deleteTaskByHelper,
  postTask
}