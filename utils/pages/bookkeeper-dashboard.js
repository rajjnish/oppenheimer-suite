const { expect } = require('@playwright/test');

class BookkeeperDashboard {
    constructor(page) {
        this.page = page;
        this.generateTaxReliefButton = page.locator('button:text("Generate Tax Relief File")');
        this.statusMessage = page.locator('text=Nothing running at the moment');
        this.logoutButton = page.locator('button:text("Log out")');
        this.searchInput = page.locator('input[placeholder*="Enter name here"]');
    }

    async waitForDashboard() {
        await expect(this.page).toHaveURL(/\/bookkeeper\/dashboard/);
        await expect(this.page.locator('text=Welcome Home Moh Peh!')).toBeVisible();
    }

    async generateTaxReliefFile() {
        await this.generateTaxReliefButton.click();
        try {
            await this.page.waitForTimeout(2000);
            await expect(this.statusMessage).toBeVisible({ timeout: 5000 });
        } catch (error) {
            console.log('Status message not found, proceeding with verification');
        }
    }

    async searchHero(name) {
        await this.searchInput.fill(name);
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
    }

    async isHeroPresent(name) {
        const heroRow = this.page.locator(`text="${name}"`).first();
        try {
            await expect(heroRow).toBeVisible({ timeout: 5000 });
            return true;
        } catch (error) {
            return false;
        }
    }

    async getHeroTaxRelief(name) {
        const heroRow = this.page.locator(`tr:has-text("${name}")`);
        await expect(heroRow).toBeVisible({ timeout: 5000 });
        const taxReliefCell = heroRow.locator('td:last-child');
        return await taxReliefCell.innerText();
    }

    async logout() {
        await this.logoutButton.click();
        await expect(this.page).toHaveURL(/\/login/);
    }
}

module.exports = BookkeeperDashboard;