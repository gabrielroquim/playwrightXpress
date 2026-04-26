import { test, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'


test('deve poder cadastrar uma nova tarefa', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill(faker.lorem.words())
  // DICA recurso exclusivo do Playwright para selecionar um elemento com base em parte de seu nome de classe, usando o operador *=
  await page.click('css=button >> text=Create') /// em vez de usar xpath, podemos usar o seletor de texto do Playwright para clicar no botão "Create"
  //usando xpath
  // await page.click('//button[contains(text(),"Create")]')

})