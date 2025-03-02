const ApiHelper = require('../../utils/helpers/api-helper');
class ApiPayloads {
    static getValidHero(overrides = {}) {
        const defaultPayload = {
            natid: ApiHelper.generateRandomNatId(),
            name: "Test Hero",
            gender: "MALE",
            birthDate: "1990-01-01T00:00:00",
            deathDate: null,
            salary: 5000.00,
            taxPaid: 500.00,
            browniePoints: 10
        };

        return { ...defaultPayload, ...overrides };
    }
    static getInvalidHero(invalidField) {
        const basePayload = this.getValidHero();

        switch (invalidField) {
            case 'natid':
                basePayload.natid = "invalid-natid"; // Not in correct format
                break;
            case 'name':
                basePayload.name = ""; // Empty name
                break;
            case 'gender':
                basePayload.gender = "OTHER"; // Not MALE or FEMALE
                break;
            case 'birthDate':
                basePayload.birthDate = "2050-01-01T00:00:00"; // Future date
                break;
            case 'salary':
                basePayload.salary = -1000; // Negative salary
                break;
            case 'taxPaid':
                basePayload.taxPaid = -100; // Negative tax paid
                break;
            default:
                break;
        }

        return basePayload;
    }

    static getHeroWithVouchers(overrides = {}) {
        const basePayload = this.getValidHero(overrides);

        // Add vouchers to the payload
        basePayload.vouchers = [
            {
                voucherName: "Test Voucher 1",
                voucherType: "TRAVEL"
            },
            {
                voucherName: "Test Voucher 2",
                voucherType: "FOOD"
            }
        ];

        return basePayload;
    }

    static getInvalidHeroWithVouchers(invalidField) {
        let basePayload = this.getHeroWithVouchers();

        switch (invalidField) {
            case 'emptyVouchers':
                basePayload.vouchers = [];
                break;
            case 'nullVouchers':
                basePayload.vouchers = null;
                break;
            case 'invalidVoucherName':
                basePayload.vouchers[0].voucherName = "";
                break;
            case 'invalidVoucherType':
                basePayload.vouchers[0].voucherType = "INVALID";
                break;
            default:
                break;
        }

        return basePayload;
    }
}

module.exports = ApiPayloads;