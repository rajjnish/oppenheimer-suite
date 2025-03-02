/**
 * Utility to mock API responses
 */
class ApiMock {
    /**
     * Mock a response for creating a hero
     * @param {Object} heroData - Hero data from the request
     * @returns {Object} Mock response object
     */
    static createHeroResponse(heroData) {
        // Check for validation errors
        const validationError = this.validateHero(heroData);
        if (validationError) {
            return {
                status: () => 400,
                json: async () => ({
                    message: validationError,
                    timestamp: new Date().toISOString()
                })
            };
        }

        return {
            status: () => 200,
            json: async () => ({
                message: "Successfully created",
                timestamp: new Date().toISOString()
            })
        };
    }

    /**
     * Mock a response for creating a hero with vouchers
     * @param {Object} heroData - Hero with vouchers data from the request
     * @returns {Object} Mock response object
     */
    static createHeroWithVouchersResponse(heroData) {
        // Check for validation errors in hero data
        const validationError = this.validateHero(heroData);
        if (validationError) {
            return {
                status: () => 400,
                json: async () => ({
                    message: validationError,
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Check for validation errors in vouchers
        const vouchersError = this.validateVouchers(heroData.vouchers);
        if (vouchersError) {
            return {
                status: () => 400,
                json: async () => ({
                    message: vouchersError,
                    timestamp: new Date().toISOString()
                })
            };
        }

        return {
            status: () => 200,
            json: async () => ({
                message: "Successfully created hero with vouchers",
                timestamp: new Date().toISOString()
            })
        };
    }

    /**
     * Mock a response for checking if a hero owes money
     * @param {string} natid - National ID number
     * @returns {Object} Mock response object
     */
    static heroOwesMoneyResponse(natid) {
        // Validate natid is numeric
        if (!/^\d+$/.test(natid)) {
            return {
                status: () => 400,
                json: async () => ({
                    message: "National ID must be numeric",
                    timestamp: new Date().toISOString()
                })
            };
        }

        // Generate a deterministic response based on the natid
        const oweStatus = parseInt(natid) % 2 === 0 ? "OWE" : "NIL";

        return {
            status: () => 200,
            json: async () => ({
                message: {
                    data: `natid-${natid}`,
                    status: oweStatus
                },
                timestamp: new Date().toISOString()
            })
        };
    }

    /**
     * Mock a response for voucher statistics
     * @returns {Object} Mock response object
     */
    static voucherStatisticsResponse() {
        return {
            status: () => 200,
            json: async () => ({
                data: [
                    {
                        name: "Test Hero 1",
                        voucherType: "TRAVEL",
                        count: 2
                    },
                    {
                        name: "Test Hero 1",
                        voucherType: "FOOD",
                        count: 2
                    },
                    {
                        name: "Test Hero 2",
                        voucherType: "TRAVEL",
                        count: 1
                    },
                    {
                        name: "Test Hero 2",
                        voucherType: "FOOD",
                        count: 1
                    },
                    {
                        name: "Test Hero 3",
                        voucherType: "TRAVEL",
                        count: 1
                    },
                    {
                        name: "Test Hero 3",
                        voucherType: "FOOD",
                        count: 1
                    }
                ]
            })
        };
    }

    /**
     * Validate hero data
     * @param {Object} heroData - Hero data to validate
     * @returns {string|null} Validation error message or null if valid
     */
    static validateHero(heroData) {
        // Validate natid format
        if (!heroData.natid || !/^natid-\d{1,7}$/.test(heroData.natid)) {
            return "Invalid National ID format. Must be in format 'natid-number' where number is between 0 and 9999999.";
        }

        // Validate name
        if (!heroData.name || heroData.name.length < 1 || heroData.name.length > 100) {
            return "Invalid name. Must be between 1 and 100 characters.";
        }

        // Validate gender
        if (!heroData.gender || !['MALE', 'FEMALE'].includes(heroData.gender)) {
            return "Invalid gender. Must be MALE or FEMALE.";
        }

        // Validate birthDate
        if (!heroData.birthDate) {
            return "Birth date is required.";
        }

        // Validate birthDate is not in the future
        const birthDate = new Date(heroData.birthDate);
        if (isNaN(birthDate.getTime())) {
            return "Invalid birth date format.";
        }

        if (birthDate > new Date()) {
            return "Birth date cannot be in the future.";
        }

        // Validate salary and taxPaid are not negative
        if (heroData.salary < 0) {
            return "Salary cannot be negative.";
        }

        if (heroData.taxPaid < 0) {
            return "Tax paid cannot be negative.";
        }

        return null;
    }

    /**
     * Validate vouchers data
     * @param {Array} vouchers - Vouchers data to validate
     * @returns {string|null} Validation error message or null if valid
     */
    static validateVouchers(vouchers) {
        // Vouchers must not be null or empty
        if (!vouchers || !Array.isArray(vouchers) || vouchers.length === 0) {
            return "Vouchers cannot be empty.";
        }

        // Validate each voucher
        for (const voucher of vouchers) {
            if (!voucher.voucherName || voucher.voucherName.trim() === '') {
                return "Voucher name cannot be empty.";
            }

            if (!voucher.voucherType || !['TRAVEL', 'FOOD', 'MEDICAL', 'ENTERTAINMENT'].includes(voucher.voucherType)) {
                return "Invalid voucher type.";
            }
        }

        return null;
    }
}

module.exports = ApiMock;