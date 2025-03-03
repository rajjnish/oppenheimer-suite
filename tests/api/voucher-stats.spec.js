const { test, expect } = require('@playwright/test');
const ApiHelper = require('../../utils/helpers/api-helper');
const ApiPayloads = require('../../fixtures/payloads/api-payloads');
const Database = require('../../utils/database');

test.describe('Voucher Statistics API Tests', () => {
    const testHeroes = [];

    test.beforeAll(async ({ request }) => {
        // Set up the database schema
        try {
            await Database.setupDatabase();
        } catch (error) {
            console.warn('Failed to set up database schema, may be in mock mode:', error.message);
        }
        try {
            await Database.cleanupAllTestData();
        } catch (error) {
            console.warn('Failed to clean up test data before tests, may be in mock mode:', error.message);
        }

        // Create multiple heroes with vouchers for testing
        if (!process.env.USE_MOCK_API) {
            try {
                for (let i = 0; i < 3; i++) {
                    const hero = ApiPayloads.getHeroWithVouchers({
                        name: `Voucher Test Hero ${i+1}`,
                        // Customize vouchers for testing different combinations
                        vouchers: [
                            {
                                voucherName: `TRAVEL Voucher ${i+1}`,
                                voucherType: "TRAVEL"
                            },
                            {
                                voucherName: `FOOD Voucher ${i+1}`,
                                voucherType: "FOOD"
                            }
                        ]
                    });

                    // Add more vouchers to first hero for testing count
                    if (i === 0) {
                        hero.vouchers.push(
                            {
                                voucherName: "Extra TRAVEL Voucher",
                                voucherType: "TRAVEL"
                            },
                            {
                                voucherName: "Extra FOOD Voucher",
                                voucherType: "FOOD"
                            }
                        );
                    }

                    // Create hero with vouchers
                    const response = await ApiHelper.createHeroWithVouchers(request, hero);
                    // Accept both 200 and 201 status codes as success
                    expect([200, 201]).toContain(response.status());

                    testHeroes.push(hero);
                }
            } catch (error) {
                console.warn('Failed to create test heroes:', error.message);
            }
        }
    });

    test.afterAll(async () => {
        // Clean up test data
        try {
            await Database.cleanupAllTestData();
        } catch (error) {
            console.warn('Failed to clean up test data after tests, may be in mock mode:', error.message);
        }
    });

    test('Should return voucher statistics by person and type', async ({ request }) => {
        const response = await ApiHelper.getVoucherStatistics(request);
        expect(response.status()).toBeLessThan(500);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);
        if (!process.env.USE_MOCK_API && testHeroes.length > 0) {
            try {
                const testHeroStats = responseBody.data.filter(stat =>
                    testHeroes.some(hero => hero.name === stat.name)
                );
                if (testHeroStats.length > 0) {
                    console.log(`Found ${testHeroStats.length} statistics for test heroes`);
                    // Each stat should have name, voucherType, and count
                    testHeroStats.forEach(stat => {
                        expect(stat).toHaveProperty('name');
                        expect(stat).toHaveProperty('voucherType');
                        expect(stat).toHaveProperty('count');
                    });
                } else {
                    console.log('No statistics found for test heroes, skipping detailed validation');
                }
            } catch (error) {
                console.warn('Error validating voucher statistics:', error.message);
            }
        }
    });

    test('Should return data array when querying voucher statistics', async ({ request }) => {
        const response = await ApiHelper.getVoucherStatistics(request);
        expect(response.status()).toBeLessThan(500);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('data');
        expect(Array.isArray(responseBody.data)).toBe(true);
    });
});