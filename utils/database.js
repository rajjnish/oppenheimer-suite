const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration from environment variables
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'userpassword',
    database: process.env.DB_NAME || 'testdb',
    connectTimeout: 10000
};

// Flag to indicate if in mock mode
const USE_MOCK_DB = process.env.USE_MOCK_DB === 'true';

/**
 * Database utility class for database operations
 */
class Database {
    /**
     * Set up the database schema
     * @returns {Promise<void>}
     */
    static async setupDatabase() {
        const connection = await this.connect();
        if (!connection) return;

        try {
            // Create WORKING_CLASS_HEROES table if it doesn't exist
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS WORKING_CLASS_HEROES (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  natid VARCHAR(50) NOT NULL UNIQUE,
                  name VARCHAR(100) NOT NULL,
                  gender ENUM('MALE', 'FEMALE') NOT NULL,
                  birth_date DATETIME NOT NULL,
                  death_date DATETIME,
                  salary DECIMAL(10, 2) NOT NULL,
                  tax_paid DECIMAL(10, 2) NOT NULL,
                  brownie_points INT
                )
            `);

            // Create VOUCHERS table if it doesn't exist
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS VOUCHERS (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  natid VARCHAR(50) NOT NULL,
                  voucher_name VARCHAR(100) NOT NULL,
                  voucher_type VARCHAR(50) NOT NULL,
                  FOREIGN KEY (natid) REFERENCES WORKING_CLASS_HEROES(natid) ON DELETE CASCADE
                )
            `);

            // Create FILE table if it doesn't exist
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS FILE (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  file_type VARCHAR(50) NOT NULL,
                  status VARCHAR(20) NOT NULL,
                  total_count INT NOT NULL,
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('Database schema setup complete');
        } catch (error) {
            console.error('Error setting up database schema:', error);
            throw error;
        } finally {
            if (connection) await connection.end();
        }
    }

    /**
     * Create a database connection
     * @returns {Promise<mysql.Connection|null>} Database connection or null if in mock mode
     */
    static async connect() {
        if (USE_MOCK_DB) {
            console.log('Using mock database mode');
            return null;
        }

        try {
            return await mysql.createConnection(dbConfig);
        } catch (error) {
            console.error('Database connection error:', error);
            if (!USE_MOCK_DB) {
                throw error;
            }
            return null;
        }
    }

    /**
     * Execute a SQL query
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Promise<any>} Query results
     */
    static async query(sql, params = []) {
        if (USE_MOCK_DB) {
            console.log(`Mock DB: Would execute SQL: ${sql} with params: ${params}`);
            return this.getMockQueryResults(sql, params);
        }

        let connection;
        try {
            connection = await this.connect();
            if (!connection) {
                return this.getMockQueryResults(sql, params);
            }
            const [results] = await connection.execute(sql, params);
            return results;
        } catch (error) {
            console.error('Query execution error:', error);
            if (!USE_MOCK_DB) {
                throw error;
            }
            return this.getMockQueryResults(sql, params);
        } finally {
            if (connection) await connection.end();
        }
    }

    /**
     * Get mock query results based on the query and parameters
     * @param {string} sql - SQL query
     * @param {Array} params - Query parameters
     * @returns {Array} Mock query results
     */
    static getMockQueryResults(sql, params = []) {
        console.log(`Generating mock results for SQL: ${sql}`);

        if (sql.includes('SELECT COUNT(*) as count FROM WORKING_CLASS_HEROES WHERE natid =')) {
            const natid = params[0];
            return [{ count: natid && natid.startsWith('natid-') && !natid.includes('invalid') ? 1 : 0 }];
        }

        if (sql.includes('SELECT * FROM WORKING_CLASS_HEROES WHERE natid =')) {
            const natid = params[0];
            if (natid && natid.startsWith('natid-') && !natid.includes('invalid')) {
                return [{
                    id: 123,
                    natid: natid,
                    name: 'Mock Hero',
                    gender: 'MALE',
                    birth_date: '1990-01-01T00:00:00',
                    death_date: null,
                    salary: 5000,
                    tax_paid: 500,
                    brownie_points: 10
                }];
            }
            return [];
        }

        if (sql.includes('SELECT * FROM VOUCHERS WHERE natid =')) {
            const natid = params[0];
            if (natid && natid.startsWith('natid-') && !natid.includes('invalid')) {
                return [
                    {
                        id: 456,
                        natid: natid,
                        voucher_name: 'Mock Voucher 1',
                        voucher_type: 'TRAVEL'
                    },
                    {
                        id: 457,
                        natid: natid,
                        voucher_name: 'Mock Voucher 2',
                        voucher_type: 'FOOD'
                    }
                ];
            }
            return [];
        }

        if (sql.includes('SELECT * FROM FILE WHERE FILE_TYPE =')) {
            return [
                {
                    id: 789,
                    file_type: params[0],
                    status: 'COMPLETED',
                    total_count: 5,
                    created_at: new Date().toISOString()
                }
            ];
        }

        // For DELETE queries, return an empty array
        if (sql.includes('DELETE FROM')) {
            return [];
        }

        return [];
    }

    /**
     * Check if a hero exists in the database
     * @param {string} natid - National ID of the hero
     * @returns {Promise<boolean>} True if hero exists, false otherwise
     */
    static async heroExists(natid) {
        const sql = 'SELECT COUNT(*) as count FROM WORKING_CLASS_HEROES WHERE natid = ?';
        const results = await this.query(sql, [natid]);
        return results && results[0] && results[0].count > 0;
    }

    /**
     * Get hero details from the database
     * @param {string} natid - National ID of the hero
     * @returns {Promise<Object|null>} Hero details or null if not found
     */
    static async getHero(natid) {
        const sql = 'SELECT * FROM WORKING_CLASS_HEROES WHERE natid = ?';
        const results = await this.query(sql, [natid]);
        return results.length > 0 ? results[0] : null;
    }

    /**
     * Get vouchers for a hero
     * @param {string} natid - National ID of the hero
     * @returns {Promise<Array>} List of vouchers
     */
    static async getVouchers(natid) {
        const sql = 'SELECT * FROM VOUCHERS WHERE natid = ?';
        return await this.query(sql, [natid]);
    }

    /**
     * Get file records from the FILE table
     * @param {string} fileType - Type of file (e.g., TAX_RELIEF)
     * @returns {Promise<Array>} List of file records
     */
    static async getFileRecords(fileType) {
        const sql = 'SELECT * FROM FILE WHERE FILE_TYPE = ? ORDER BY ID DESC LIMIT 1';
        return await this.query(sql, [fileType]);
    }

    /**
     * Clean up test data from the database
     * @param {string} natid - National ID of the hero to delete
     * @returns {Promise<void>}
     */
    static async cleanupHero(natid) {
        // Delete vouchers first due to foreign key constraints
        await this.query('DELETE FROM VOUCHERS WHERE natid = ?', [natid]);
        // Then delete the hero
        await this.query('DELETE FROM WORKING_CLASS_HEROES WHERE natid = ?', [natid]);
    }

    /**
     * Clean up all test data from the database
     * @returns {Promise<void>}
     */
    static async cleanupAllTestData() {
        // Delete test data with natid starting with 'test-'
        await this.query('DELETE FROM VOUCHERS WHERE natid LIKE ?', ['test-%']);
        await this.query('DELETE FROM WORKING_CLASS_HEROES WHERE natid LIKE ?', ['test-%']);

        // Also clean up test data with natid-pattern for safety
        await this.query('DELETE FROM VOUCHERS WHERE natid LIKE ?', ['natid-1%']);
        await this.query('DELETE FROM WORKING_CLASS_HEROES WHERE natid LIKE ?', ['natid-1%']);
        await this.query('DELETE FROM VOUCHERS WHERE natid LIKE ?', ['natid-2%']);
        await this.query('DELETE FROM WORKING_CLASS_HEROES WHERE natid LIKE ?', ['natid-2%']);
    }
}

module.exports = Database;