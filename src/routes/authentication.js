const passport = require('passport');
const express = require('express');
const pool = require('../database');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup-view/signup');
});

router.post('/signup', (req, res, next) => {
    const { role } = req.body;
    const roleSelected = {
        role
    }
    if(roleSelected.role === 'user'){
        passport.authenticate('local.signup', {
            successRedirect: '/user-data',
            failureRedirect: '/signup',
            failureFlash: true
        })(req, res, next);
    }else{
        passport.authenticate('local.signup', {
            successRedirect: '/analist-data',
            failureRedirect: '/signup',
            failureFlash: true
        })(req, res, next);
    }

});

module.exports = router