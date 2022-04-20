const express = require('express');

const router = express.Router();

let informationData;

router.get('/information-data', (req, res) => {
    res.send('Hola')
});



module.exports = router;