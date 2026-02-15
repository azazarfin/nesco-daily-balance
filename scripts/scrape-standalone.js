require('dotenv').config();
const mongoose = require('mongoose');
const { runScraper } = require('../index');

async function main() {
    console.log('Starting standalone scraper script...');

    // 1. Connect to MongoDB
    if (!process.env.MONGO_URI) {
        console.error('Error: MONGO_URI is not defined in environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB.');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }

    // 2. Run the Scraper
    try {
        const record = await runScraper();
        if (record) {
            console.log(`Scrape successful. Balance: ${record.balance} Tk`);
            console.log('Record saved to database.');

            // Optional: You could add simple email alert logic here too if desired, 
            // but for now we just log it.
            if (record.balance < 200) {
                console.log('::warning::Low Balance Detected!');
            }
        } else {
            console.log('Scraper finished but no record was returned (possibly no change or error handled internally).');
        }
    } catch (error) {
        console.error('Critical error during scraping:', error);
        process.exit(1);
    } finally {
        // 3. Cleanup and Exit
        try {
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB.');
        } catch (disconnectError) {
            console.error('Error disconnecting:', disconnectError);
        }
        console.log('Script finished successfully.');
        process.exit(0);
    }
}

main();
