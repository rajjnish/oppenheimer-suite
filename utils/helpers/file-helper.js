const fs = require('fs-extra');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

/**
 * Helper functions for file operations
 */
class FileHelper {
    /**
     * Create a CSV file with hero data
     * @param {string} filePath - Path to save the CSV file
     * @param {Array<Object>} heroes - Array of hero objects
     * @returns {Promise<string>} Path to the created CSV file
     */
    static async createHeroCsv(filePath, heroes) {
        const rows = heroes.map(hero => [
            hero.natid,
            hero.name,
            hero.gender,
            hero.birthDate,
            hero.deathDate || '',
            hero.salary,
            hero.taxPaid,
            hero.browniePoints || ''
        ]);

        const csvContent = stringify(rows, {
            header: false,
            delimiter: ','
        });

        await fs.ensureDir(path.dirname(filePath));
        await fs.writeFile(filePath, csvContent);

        return filePath;
    }

    /**
     * Read and parse a CSV file
     * @param {string} filePath - Path to the CSV file
     * @param {boolean} hasHeaders - Whether the CSV file has headers
     * @returns {Promise<Array<Object>>} Parsed CSV data
     */
    static async readCsv(filePath, hasHeaders = false) {
        const content = await fs.readFile(filePath, 'utf8');

        const records = parse(content, {
            columns: hasHeaders,
            skip_empty_lines: true,
            trim: true
        });

        return records;
    }

    /**
     * Read the tax relief file
     * @param {string} filePath - Path to the tax relief file
     * @returns {Promise<Object>} Tax relief data with body and footer
     */
    static async readTaxReliefFile(filePath) {
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const lines = content.trim().split('\n');

            // Last line is the footer (count of records)
            const footer = parseInt(lines[lines.length - 1], 10);

            // All lines except the last one are the body
            const body = lines.slice(0, lines.length - 1).map(line => {
                const [natid, taxRelief] = line.split(',').map(part => part.trim());
                return { natid, taxRelief: parseFloat(taxRelief) };
            });

            return { body, footer };
        } catch (error) {
            console.error('Error reading tax relief file:', error);
            throw error;
        }
    }

    /**
     * Create a temporary directory for test files
     * @returns {Promise<string>} Path to the temporary directory
     */
    static async createTempDir() {
        const tempDir = path.join(__dirname, '..', '..', 'temp');
        await fs.ensureDir(tempDir);
        return tempDir;
    }

    /**
     * Clean up temporary files and directories
     * @param {string} dirPath - Path to the directory to clean up
     * @returns {Promise<void>}
     */
    static async cleanup(dirPath) {
        try {
            await fs.remove(dirPath);
        } catch (error) {
            console.error('Error cleaning up temporary files:', error);
        }
    }

    /**
     * Wait for a file to exist
     * @param {string} filePath - Path to the file
     * @param {number} timeoutMs - Timeout in milliseconds
     * @returns {Promise<boolean>} True if the file exists, false if timeout
     */
    static async waitForFile(filePath, timeoutMs = 10000) {
        const startTime = Date.now();

        while (Date.now() - startTime < timeoutMs) {
            try {
                const exists = await fs.pathExists(filePath);
                if (exists) return true;
            } catch (error) {
                // Ignore errors and continue waiting
            }

            // Wait a short time before checking again
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return false;
    }
}

module.exports = FileHelper;