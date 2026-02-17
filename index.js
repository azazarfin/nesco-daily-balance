require('dotenv').config();
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');

const BalanceRecord = require('./models/BalanceRecord');

async function runScraper() {
    console.log('Starting scraper...');

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
        if (!process.env.MONGO_URI) {
            console.error('Error: MONGO_URI not found in .env file.');
            return null;
        }
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB.');
        } catch (err) {
            console.error('MongoDB connection error:', err);
            return null;
        }
    }

    // Launch Browser
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    });
    const page = await browser.newPage();
    let savedRecord = null;

    try {
        // Navigation
        console.log('Navigating to https://customer.nesco.gov.bd/pre/panel...');
        await page.goto('https://customer.nesco.gov.bd/pre/panel', { waitUntil: 'networkidle0' });

        // Interaction
        const customerNumber = '33022824';
        const inputSelector = '#cust_no';
        console.log(`Waiting for input box (${inputSelector})...`);
        await page.waitForSelector(inputSelector);
        await page.type(inputSelector, customerNumber);
        console.log(`Typed customer number: ${customerNumber}`);

        const buttonSelector = '#recharge_hist_button';
        console.log(`Waiting for 'Recharge History' button (${buttonSelector})...`);
        await page.waitForSelector(buttonSelector);

        const navigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0' });
        await page.click(buttonSelector);
        console.log('Clicked "Recharge History" button. Waiting for results...');
        await navigationPromise;

        // Scraping
        const scrapeData = await page.evaluate(() => {
            const results = {};

            // 1. Balance Strategy
            const balanceLabel = document.evaluate("//*[contains(text(), 'অবশিষ্ট ব্যালেন্স')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (balanceLabel) {
                let p = balanceLabel.parentElement;
                let foundInput = null;
                for (let i = 0; i < 4 && p; i++) {
                    const inputs = p.querySelectorAll('input');
                    if (inputs.length > 0) {
                        foundInput = inputs[inputs.length - 1];
                        break;
                    }
                    p = p.parentElement;
                }
                if (foundInput) {
                    results.remainingBalance = foundInput.value.trim();
                } else {
                    results.remainingBalance = null;
                }
            } else {
                results.remainingBalance = null;
            }

            // 2. Time Strategy
            const timeLabel = document.evaluate("//*[contains(text(), 'সময়')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (timeLabel) {
                results.time = timeLabel.innerText.trim();
            } else {
                results.time = null;
            }

            return results;
        });

        console.log('Scraped Data:', scrapeData);

        // Parsing and Saving
        if (scrapeData.remainingBalance) {
            // Remove 'Tk', commas, spaces, and ensure it is a valid number format
            const cleanBalanceStr = scrapeData.remainingBalance.replace(/[^\d.-]/g, '');
            const balanceFloat = parseFloat(cleanBalanceStr);

            if (!isNaN(balanceFloat)) {
                savedRecord = new BalanceRecord({
                    balance: balanceFloat,
                    rawTimeText: scrapeData.time
                });

                await savedRecord.save();
                console.log('Data saved to MongoDB:', savedRecord);
            } else {
                console.error('Failed to parse balance:', scrapeData.remainingBalance);
            }
        } else {
            console.error('Balance not found, skipping save.');
        }

    } catch (error) {
        console.error('An error occurred during scraping:', error);
    } finally {
        await browser.close();
        // Do NOT close mongoose connection if running in server context
    }

    return savedRecord;
}

// Auto-run only if executed directly (not imported)
if (require.main === module) {
    (async () => {
        await runScraper();
        await mongoose.connection.close(); // Close DB only if standalone run
        console.log('Done.');
    })();
}

module.exports = { runScraper, BalanceRecord };
