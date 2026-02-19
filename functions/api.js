const serverless = require('serverless-http');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BalanceRecord = require('./models/BalanceRecord');
require('dotenv').config();

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
let conn = null;

const connectDB = async () => {
    if (conn == null) {
        conn = mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        await conn;
    }
    return conn;
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Define routes directly on app (or use a router)
const router = express.Router();

router.get('/balance', async (req, res) => {
    try {
        const records = await BalanceRecord.find().sort({ scrapedAt: -1 }).limit(30);
        res.json({ success: true, count: records.length, data: records });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

router.get('/', (req, res) => {
    res.json({ message: "API is working!", path: req.path });
});

// Use the router for the Netlify function path
app.use('/.netlify/functions/api', router);

// Export the handler
module.exports.handler = serverless(app);
