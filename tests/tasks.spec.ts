import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'


test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
  const taskName = 'Ler um livro de qualidade'
  await request.delete('http://localhost:3333/helper/tasks/' + taskName) // Limpa as tarefas antes de iniciar o teste
  
  await page.goto('http://localhost:8080');

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(taskName)
  // DICA recurso exclusivo do Playwright para selecionar um elemento com base em parte de seu nome de classe, usando o operador *=
  await page.click('css=button >> text=Create') /// em vez de usar xpath, podemos usar o seletor de texto do Playwright para clicar no botão "Create"
  //usando xpath
  // await page.click('//button[contains(text(),"Create")]')

})