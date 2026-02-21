const api = require('./functions/api.js');

const mockRequest = {
    httpMethod: 'GET',
    path: '/.netlify/functions/api/balance',
    headers: {},
};

const mockContext = {};

api.handler(mockRequest, mockContext).then(res => {
    console.log('StatusCode:', res.statusCode);
    console.log('Body:', res.body);
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
