const express = require('express');
const model = require('../lib/vital-signal-db');

require('dotenv').config();
require('twilio')("AC24d6cbd97e4536d4b5b1e797752ff69c", "501195b094519e04625db6eb422861c4");

const router = express.Router();

router.get('/information-data', (req, res) => {

    model.registrar(req.query)

    res.send(req.query)
});



module.exports = router;