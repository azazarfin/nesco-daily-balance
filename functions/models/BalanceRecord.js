const mongoose = require('mongoose');

const balanceRecordSchema = new mongoose.Schema({
    balance: {
        type: Number,
        required: true
    },
    rawTimeText: {
        type: String,
        required: false
    },
    scrapedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('BalanceRecord', balanceRecordSchema);
