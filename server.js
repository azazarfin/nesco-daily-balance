require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { runScraper, BalanceRecord } = require('./index');

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

// Endpoint: Trigger scraper & check low balance
app.get('/api/scrape-now', async (req, res) => {
    try {
        console.log('Manual scrape triggered via API...');
        const record = await runScraper(); // This will save to DB automatically

        if (record) {
            let message = 'Scrape successful.';
            let notificationSent = false;

            // Check Low Balance
            if (record.balance < 200) {
                const alertMsg = `LOW BALANCE ALERT: Current balance is ${record.balance} Tk.`;
                console.log(alertMsg);

                // Send Email if credentials exist
                if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
                    try {
                        await transporter.sendMail({
                            from: process.env.EMAIL_USER,
                            to: process.env.EMAIL_USER, // Sending to self
                            subject: 'NESCO Low Balance Alert',
                            text: alertMsg
                        });
                        console.log('Email notification sent.');
                        notificationSent = true;
                    } catch (emailErr) {
                        console.error('Failed to send email:', emailErr);
                    }
                } else {
                    console.log('Email credentials not configured. Skipping email.');
                }
                message += ` Low balance detected! (${record.balance} Tk)`;
            }

            res.json({
                success: true,
                message: message,
                data: record,
                lowBalance: record.balance < 200,
                notificationSent: notificationSent
            });
        } else {
            res.status(500).json({ success: false, error: 'Scraper failed to retrieve data.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server error during scrape.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
