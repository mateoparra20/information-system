const express = require('express');
const pool = require('../database');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup-view/signup');
})

module.exports = router