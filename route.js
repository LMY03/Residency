const express = require('express');
const app = express();

const residency = require('./controller/residency.js');
const login = require('./controller/login.js');
const report = require('./controller/report.js');

app.get('/', residency.render);
app.post('/clockIn', residency.run);

app.get('/get-time', residency.time);

app.get('/login', login.render);
app.post('/loggingin', login.validate);

app.get('/report', report.render);

module.exports = app;