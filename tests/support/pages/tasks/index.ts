import { TaskModel } from './../../../fixtures/task.model';
import { Page, expect } from '@playwright/test'

export class TasksPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async go() {
        await this.page.goto('http://localhost:8080')
    }

    async create(task: TaskModel) {

        // 💡 DICA 2 — Seletor com `*=`: localiza o input que contenha "InputNewTask" em
        // qualquer parte da classe CSS — útil quando o framework gera classes com hash dinâmico.
        const inputTaskName = this.page.locator('input[class*=InputNewTask]')
        await inputTaskName.fill(task.name)

        // 💡 DICA 3 — Seletor de texto com `>> text=`: combina CSS + texto sem usar XPath.
        // Alternativa XPath (mais verbosa): page.click('//button[contains(text(),"Create")]')
        await this.page.click('css=button >> text=Create')
    }

    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator('.swal2-html-container')
        await expect(target).toHaveText(text)
        //await expect(alert).toHaveText('Task already exists')
    }
}
