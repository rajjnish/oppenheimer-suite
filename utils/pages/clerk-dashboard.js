const { expect } = require('@playwright/test');

class ClerkDashboard {
    constructor(page) {
        this.page = page;
        this.addHeroButton = page.locator('button:text("Add a hero")');
        this.uploadCSVOption = page.locator('a:text("Upload a csv file")');
        this.fileInput = page.locator('input[type="file"]');
        this.createButton = page.locator('button:text("Create")');
        this.backButton = page.locator('button:text("Back")');
        this.successMessage = page.locator('div:text("Created Successfully!")');
        this.errorMessage = page.locator('div:text("Unable to create hero!")');
        this.logoutButton = page.locator('button:text("Log out")');
    }

    async waitForDashboard() {
        await expect(this.page).toHaveURL(/\/clerk\/dashboard/);
        await this.page.waitForSelector('text=Clerk Dashboard', { timeout: 5000 });
    }

    async uploadCSV(filePath) {
        await this.addHeroButton.click();
        await this.uploadCSVOption.click();
        await this.page.waitForSelector('text=Upload CSV file', { timeout: 10000 });
        await this.fileInput.setInputFiles(filePath);
        await this.createButton.click();
    }

    async isUploadSuccessful() {
        try {
            await this.page.waitForSelector('text=Created Successfully!', { timeout: 10000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async hasUploadError() {
        try {
            await this.page.waitForSelector('text=Unable to create hero!', { timeout: 10000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getErrorMessage() {
        await this.page.waitForSelector('text=Unable to create hero!', { timeout: 10000 });
        const errorElement = this.page.locator('.alert-danger');
        return await errorElement.innerText();
    }

    async navigateBack() {
        await this.backButton.click();
        await this.waitForDashboard();
    }

    async logout() {
        await this.logoutButton.click();
    }
}

module.exports = ClerkDashboard;