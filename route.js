const express = require('express');
const router = express();

const residency = require('./controller/residency.js');
const report = require('./controller/report.js');

router.get('/', residency.render);
router.post('/clock', residency.run);

router.get('/get-time', residency.time);

router.get('/report', report.render);

module.exports = router;