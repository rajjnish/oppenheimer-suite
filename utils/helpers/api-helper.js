const ApiMock = require('./api-mock');

// Flag to indicate if we're in mock mode
const USE_MOCK_API = process.env.USE_MOCK_API === 'true';

/**
 * Helper functions for API testing
 */
class ApiHelper {
    /**
     * Create a working class hero
     * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
     * @param {Object} heroData - Hero data
     * @returns {Promise<Object>} API response
     */
    static async createHero(request, heroData) {
        if (USE_MOCK_API) {
            console.log('Using mock API mode for createHero');
            return ApiMock.createHeroResponse(heroData);
        }

        try {
            return await request.post('/api/v1/hero', {
                data: heroData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('API request failed:', error);
            if (!USE_MOCK_API) {
                throw error;
            }
            return ApiMock.createHeroResponse(heroData);
        }
    }

    /**
     * Create a hero with vouchers
     * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
     * @param {Object} heroData - Hero data with vouchers
     * @returns {Promise<Object>} API response
     */
    static async createHeroWithVouchers(request, heroData) {
        if (USE_MOCK_API) {
            console.log('Using mock API mode for createHeroWithVouchers');
            return ApiMock.createHeroWithVouchersResponse(heroData);
        }

        try {
            return await request.post('/api/v1/hero/vouchers', {
                data: heroData,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('API request failed:', error);
            if (!USE_MOCK_API) {
                throw error;
            }
            return ApiMock.createHeroWithVouchersResponse(heroData);
        }
    }

    /**
     * Check if a hero owes money
     * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
     * @param {string} natid - National ID number without the "natid-" prefix
     * @returns {Promise<Object>} API response
     */
    static async checkHeroOwesMoney(request, natid) {
        if (USE_MOCK_API) {
            console.log('Using mock API mode for checkHeroOwesMoney');
            return ApiMock.heroOwesMoneyResponse(natid);
        }

        try {
            return await request.get(`/api/v1/hero/owe-money?natid=${natid}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('API request failed:', error);
            if (!USE_MOCK_API) {
                throw error;
            }
            return ApiMock.heroOwesMoneyResponse(natid);
        }
    }

    /**
     * Get voucher statistics by person and type
     * @param {import('@playwright/test').APIRequestContext} request - Playwright API request context
     * @returns {Promise<Object>} API response
     */
    static async getVoucherStatistics(request) {
        if (USE_MOCK_API) {
            console.log('Using mock API mode for getVoucherStatistics');
            return ApiMock.voucherStatisticsResponse();
        }

        try {
            return await request.get('/api/v1/voucher/by-person-and-type', {
                headers: {
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.error('API request failed:', error);
            if (!USE_MOCK_API) {
                throw error;
            }
            return ApiMock.voucherStatisticsResponse();
        }
    }

    /**
     * Helper method to generate a random National ID
     * @returns {string} Random National ID in the format "natid-XXXXXXX"
     */
    static generateRandomNatId() {
        const randomNumber = Math.floor(Math.random() * 9999999);
        return `natid-${randomNumber}`;
    }

    /**
     * Helper method to generate a unique test National ID
     * @returns {string} Unique test National ID in the format "test-TIMESTAMP-RANDOM"
     */
    static generateTestNatId() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `test-${timestamp}-${random}`;
    }

    /**
     * Helper method to generate a random date in the past
     * @param {number} yearsBack - Maximum number of years back for the date
     * @returns {string} Date string in the format "YYYY-MM-DDT00:00:00"
     */
    static generatePastDate(yearsBack = 50) {
        const now = new Date();
        const pastDate = new Date(
            now.getFullYear() - Math.floor(Math.random() * yearsBack),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
        );

        return pastDate.toISOString().split('T')[0] + 'T00:00:00';
    }
}

module.exports = ApiHelper;