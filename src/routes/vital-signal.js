const express = require('express');
const model = require('../lib/vital-signal-db');

require('dotenv').config();
require('twilio')("AC24d6cbd97e4536d4b5b1e797752ff69c", "848e9343dde7d345f47954f6cc96b78b");

const router = express.Router();

router.get('/information-data', (req, res) => {

    model.registrar(req.query)

    res.send(req.query)
});



module.exports = router;