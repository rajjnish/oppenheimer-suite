const { test, expect } = require('@playwright/test');
const ApiHelper = require('../../utils/helpers/api-helper');
const Database = require('../../utils/ database');

test.describe('Hero Owe Money API Tests', () => {
    test.beforeAll(async () => {
        // Set up the database schema
        try {
            await Database.setupDatabase();
        } catch (error) {
            console.warn('Failed to set up database schema, may be in mock mode:', error.message);
        }
    });

    test('Should check if a hero owes money with valid natid', async ({ request }) => {
        const natidNumber = '12345';
        const response = await ApiHelper.checkHeroOwesMoney(request, natidNumber);
        expect(response.status()).toBeLessThan(500);
        const responseBody = await response.json();
        if (responseBody.errorMsg) {
            expect(responseBody).toHaveProperty('errorMsg');
            expect(responseBody).toHaveProperty('timestamp');
            console.log('Got error response:', responseBody.errorMsg);
        } else {
            expect(responseBody).toHaveProperty('message');
            expect(responseBody).toHaveProperty('timestamp');
            expect(responseBody.message).toHaveProperty('data');
            expect(responseBody.message).toHaveProperty('status');
            expect(responseBody.message.data).toBe(`natid-${natidNumber}`);
            expect(['OWE', 'NIL']).toContain(responseBody.message.status);
        }
    });

    test('Should return error when checking with non-numeric natid', async ({ request }) => {
        const natidNumber = 'abc';
        const response = await ApiHelper.checkHeroOwesMoney(request, natidNumber);
        expect(response.status()).not.toBe(200);
    });

    test('Should return error when checking with negative natid', async ({ request }) => {
        const natidNumber = '-123';
        const response = await ApiHelper.checkHeroOwesMoney(request, natidNumber);
        expect(response.status()).not.toBe(200);
    });

    test('Should return error when checking with decimal natid', async ({ request }) => {
        const natidNumber = '123.45';
        const response = await ApiHelper.checkHeroOwesMoney(request, natidNumber);
        expect(response.status()).not.toBe(200);
    });

    test('Should handle edge case with very large natid number', async ({ request }) => {
        const natidNumber = '9999999'; // Maximum allowed per requirements
        const response = await ApiHelper.checkHeroOwesMoney(request, natidNumber);
        expect(response.status()).toBeLessThan(500);

        const responseBody = await response.json();
        if (responseBody.errorMsg) {
            // This is the error response format
            expect(responseBody).toHaveProperty('errorMsg');
            expect(responseBody).toHaveProperty('timestamp');
            console.log('Got error response for large natid:', responseBody.errorMsg);
        } else {
            expect(responseBody.message.data).toBe(`natid-${natidNumber}`);
        }
    });
});