const express = require('express');
const app = express();

const productRouter = require('./ProductRoute');
const ReportsRouter = require('./ReportsRoute');

app.use('/api/v1/Reports', ReportsRouter);
app.use('/api/v1/product', productRouter);

module.exports = app;
