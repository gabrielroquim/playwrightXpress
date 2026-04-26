import { test, expect } from '@playwright/test';


test('deve poder cadastrar uma nova tarefa', async ({ page }) => {
  await page.goto('http://localhost:8080');

  const inputTaskName = page.locator('input[class*=InputNewTask]')
  await inputTaskName.fill('Ler um livro de qualidade de software')

  await page.click('css=button >> text=Create') /// em vez de usar xpath, podemos usar o seletor de texto do Playwright para clicar no botão "Create"
 // await page.click('//button[contains(text(),"Create")]')

})