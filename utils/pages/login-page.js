const { expect } = require('@playwright/test');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[type="submit"]');
    }

    async goto() {
        await this.page.goto('/login');
        await expect(this.page).toHaveTitle(/Spring Boot Application/);
    }

    async login(username, password) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async loginAsClerk() {
        await this.login(process.env.CLERK_USERNAME || 'clerk', process.env.CLERK_PASSWORD || 'clerk');
        await expect(this.page).toHaveURL(/\/clerk\/dashboard/);
    }

    async loginAsBookkeeper() {
        await this.login(process.env.BOOKKEEPER_USERNAME || 'bk', process.env.BOOKKEEPER_PASSWORD || 'bk');
        await expect(this.page).toHaveURL(/\/bookkeeper\/dashboard/);
    }
}

module.exports = LoginPage;