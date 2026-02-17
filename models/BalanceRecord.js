const mongoose = require('mongoose');

const balanceSchema = new mongoose.Schema({
    balance: Number, // Parsed float value
    scrapedAt: { type: Date, default: Date.now },
    rawTimeText: String // The original time string from the website
});

// Check if model already exists to prevent overwrite error during hot reloads or tests
const BalanceRecord = mongoose.models.BalanceRecord || mongoose.model('BalanceRecord', balanceSchema);

module.exports = BalanceRecord;
