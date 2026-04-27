import { TaskModel } from './../../../fixtures/task.model';
import { Page } from '@playwright/test'

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

}
