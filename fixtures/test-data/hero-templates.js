const ApiHelper = require('../../utils/helpers/api-helper');

class HeroTemplates {
    static getValidHeroes(count = 5) {
        const heroes = [];

        for (let i = 0; i < count; i++) {
            heroes.push({
                natid: ApiHelper.generateRandomNatId(),
                name: `Test Hero ${i+1}`,
                gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
                birthDate: ApiHelper.generatePastDate(),
                deathDate: i % 5 === 0 ? ApiHelper.generatePastDate(1) : null,
                salary: 3000 + (i * 500),
                taxPaid: 300 + (i * 50),
                browniePoints: i % 3 === 0 ? i * 5 : null
            });
        }

        return heroes;
    }

    static getHeroesWithOneInvalid() {
        const heroes = this.getValidHeroes(4);

        // Add an invalid hero with negative salary
        heroes.push({
            natid: ApiHelper.generateRandomNatId(),
            name: 'Invalid Hero',
            gender: 'MALE',
            birthDate: ApiHelper.generatePastDate(),
            deathDate: null,
            salary: -1000, // Invalid negative salary
            taxPaid: 500,
            browniePoints: 10
        });

        return heroes;
    }

    static getInvalidHeroes() {
        return [
            // Invalid natid format
            {
                natid: 'invalid-format',
                name: 'Invalid NatID Hero',
                gender: 'MALE',
                birthDate: '1990-01-01T00:00:00',
                deathDate: null,
                salary: 5000,
                taxPaid: 500,
                browniePoints: 10
            },
            // Empty name
            {
                natid: ApiHelper.generateRandomNatId(),
                name: '',
                gender: 'FEMALE',
                birthDate: '1990-01-01T00:00:00',
                deathDate: null,
                salary: 5000,
                taxPaid: 500,
                browniePoints: 10
            },
            // Invalid gender
            {
                natid: ApiHelper.generateRandomNatId(),
                name: 'Invalid Gender Hero',
                gender: 'OTHER',
                birthDate: '1990-01-01T00:00:00',
                deathDate: null,
                salary: 5000,
                taxPaid: 500,
                browniePoints: 10
            },
            // Future birthdate
            {
                natid: ApiHelper.generateRandomNatId(),
                name: 'Future Birth Hero',
                gender: 'MALE',
                birthDate: '2050-01-01T00:00:00',
                deathDate: null,
                salary: 5000,
                taxPaid: 500,
                browniePoints: 10
            },
            // Negative salary
            {
                natid: ApiHelper.generateRandomNatId(),
                name: 'Negative Salary Hero',
                gender: 'FEMALE',
                birthDate: '1990-01-01T00:00:00',
                deathDate: null,
                salary: -5000,
                taxPaid: 500,
                browniePoints: 10
            },
            // Negative tax paid
            {
                natid: ApiHelper.generateRandomNatId(),
                name: 'Negative Tax Hero',
                gender: 'MALE',
                birthDate: '1990-01-01T00:00:00',
                deathDate: null,
                salary: 5000,
                taxPaid: -500,
                browniePoints: 10
            }
        ];
    }
}

module.exports = HeroTemplates;