const express = require('express');
const model = require('../lib/vital-signal-db');

const router = express.Router();

router.get('/information-data', (req, res) => {

    model.registrar(req.query)

    res.send(req.query)
});



module.exports = router;