import { TaskModel } from './../../../fixtures/task.model';
import { Page, expect, Locator } from '@playwright/test'

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')
    }

    async go() {
        await this.page.goto('http://localhost:8080')
    }

    async create(task: TaskModel) {

        await this.inputTaskName.fill(task.name)

        // 💡 DICA 3 — Seletor de texto com `>> text=`: combina CSS + texto sem usar XPath.
        // Alternativa XPath (mais verbosa): page.click('//button[contains(text(),"Create")]')
        await this.page.click('css=button >> text=Create')
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`//p[text()="${taskName}"]/..//button[contains(@class, "Toggle")]`)
        await target.click()
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

    async shouldBeDone(taskName: string) {
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }
}
