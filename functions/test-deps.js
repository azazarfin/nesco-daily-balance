try {
    const mongoose = require('mongoose');
    const express = require('express');
    const serverless = require('serverless-http');

    exports.handler = async function (event, context) {
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Dependencies loaded successfully!",
                versions: {
                    mongoose: mongoose.version,
                    express: require('express/package.json').version // Safer way to get express version
                }
            })
        };
    };
} catch (error) {
    exports.handler = async function (event, context) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Dependency load failed",
                error: error.message,
                stack: error.stack
            })
        };
    };
}
