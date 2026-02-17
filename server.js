require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const BalanceRecord = require('./models/BalanceRecord');

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Server connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Nodemailer Transporter (Configure with your email service)
// For testing, update these with valid credentials or use Ethereal.email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or 'hotmail', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint: Get latest 30 balance records
app.get('/api/balance', async (req, res) => {
    try {
        const records = await BalanceRecord.find().sort({ scrapedAt: -1 }).limit(30);
        res.json({ success: true, count: records.length, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// Endpoint: Manual scrape removed for serverless deployment (handled by GitHub Actions)



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
