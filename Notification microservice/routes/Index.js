const express = require('express');
const app = express();

const notificationRouter = require('./NotificationRoute');

app.use('/api/v1/Notification', notificationRouter);

module.exports = app;
