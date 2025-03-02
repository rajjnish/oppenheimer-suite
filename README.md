# Oppenheimer Project Test Automation Suite

This repository contains automated tests for the Oppenheimer Project using Playwright with JavaScript. 
The test suite covers both API and UI functionalities as specified in the requirements.

## Overview

The Oppenheimer Project is a system that helps manage working class heroes' taxation relief. The automated test suite validates:

1. API endpoints for creating and managing heroes
2. UI workflows for Clerks to upload hero data
3. UI workflows for Bookkeepers to generate tax relief reports
4. Additional API endpoints for hero vouchers, money owed, and voucher statistics

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose
- Java Runtime Environment (JRE) for running the application JAR

### Environment Configuration

The test suite uses environment variables for configuration. Create a `.env` file in the project root with the following variables:

```
# Database credentials
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASSWORD=userpassword
DB_NAME=testdb

# Application credentials
CLERK_USERNAME=clerk
CLERK_PASSWORD=clerk
BOOKKEEPER_USERNAME=bk
BOOKKEEPER_PASSWORD=bk

# Test configuration
USE_MOCK_API=false
USE_MOCK_DB=false
```

In CI environments, set these as secrets in your CI configuration.

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/rajjnish/oppenheimer-suite.git
   cd oppenheimer-test-suite
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the application under test:
   ```
   docker-compose -f local-docker-compose.yml up -d
   ```

4. Start the application:
   ```
   java -Dspring.profiles.active=prd -Dspring.datasource.url=jdbc:mysql://localhost:3306/testdb -Dspring.datasource.username=user -Dspring.datasource.password=userpassword -jar OppenheimerProjectDev.jar
   ```

5. Verify the application is running by accessing http://localhost:9997/login

### Running Tests

You can run the tests in two modes:
1. **Real mode**: Tests against the actual application
2. **Mock mode**: Tests run with mocked responses (useful for development)

#### Running Against Real Application

```bash
# Set environment variables
export USE_MOCK_API=false
export USE_MOCK_DB=false

# Or simply use the values from your .env file
npm test
```

#### Using Mock Mode

To run tests with mocked responses (useful when application is not available):

```bash
export USE_MOCK_API=true
export USE_MOCK_DB=true
npm test
```

#### Run specific test suites

```bash
# Run API tests only
npm run test:api

# Run UI tests only
npm run test:ui
```

Run a specific test file:
```bash
npx playwright test tests/api/hero.spec.js
```

View the test report:
```bash
npm run report
```

## Test Architecture

The test suite follows a modular, data-driven approach with the following components:

### Page Object Model (POM)

The UI tests use the Page Object Model design pattern to separate page interaction logic from test logic:

- **LoginPage**: Handles authentication for different user roles
- **ClerkDashboard**: Handles CSV file uploads and hero creation
- **BookkeeperDashboard**: Handles tax relief file generation

### Database Access

The `Database` class provides methods for:

- Setting up the database schema automatically
- Verifying data persistence
- Cleaning up test data
- Mocking database responses when needed

### API Testing

API tests use Playwright's API request context and include:

- Positive and negative test cases
- Validation of response status and content
- Database verification of successful operations
- Error handling for edge cases

### Test Data Management

The test suite includes:

- CSV files for batch uploads
- Template functions for generating valid and invalid data
- Helper functions for file operations

### Mock Capabilities

The test suite can run in mock mode, where:

- API responses are mocked for offline testing
- Database operations are simulated
- UI interactions are handled through mock objects

## Test Coverage

### API Tests
- Creating a single working class hero (User Story 1)
- Creating a hero with vouchers (User Story 4)
- Checking if a hero owes money (User Story 5)
- Getting voucher statistics (User Story 6)

### UI Tests
- Clerk uploading CSV files with hero data (User Story 2)
- Bookkeeper generating tax relief egress file (User Story 3)

## Troubleshooting

### Database Connection Issues

If tests fail due to database connection issues:

1. Verify Docker containers are running:
   ```
   docker ps
   ```

2. Check if the database is accessible:
   ```
   docker exec -it mysqldb mysql -u user -p
   # Enter password from .env file
   ```

3. The test framework automatically creates necessary tables, but you can manually verify:
   ```sql
   USE testdb;
   SHOW TABLES;
   ```

### Application Not Running

If the application isn't starting correctly:

1. Check Java version: `java -version` (should be Java 8 or higher)
2. Verify application logs for errors
3. Try running the application with explicit database parameters:
   ```
   java -Dspring.profiles.active=prd -Dspring.datasource.url=jdbc:mysql://localhost:3306/testdb -Dspring.datasource.username=user -Dspring.datasource.password=userpassword -jar OppenheimerProjectDev.jar
   ```

### Test Failures

If tests are failing:

1. Check the test report for detailed error messages
2. Run in mock mode to verify test logic
3. Try running a single test file to isolate the issue
4. Check if the database schema was created correctly
5. Verify that credentials in .env match the application configuration

## Future Enhancements

Future improvements that could be added to the test suite:

1. **Performance Testing**: Add load tests to evaluate system behavior under high load
2. **Security Testing**: Add tests for authentication, authorization, and input validation vulnerabilities
3. **Cross-Browser Testing**: Extend UI tests to run on multiple browsers
4. **API Contract Testing**: Add schema validation for API responses
5. **CI/CD Integration**: Add GitHub Actions or Jenkins pipeline configuration
6. **Visual Testing**: Add visual regression tests for UI components
7. **Accessibility Testing**: Add tests to ensure the application is accessible
8. **Database Migration Testing**: Add tests for database schema changes
9. **End-to-End Workflow Testing**: Add tests that combine multiple user stories into complete workflows
