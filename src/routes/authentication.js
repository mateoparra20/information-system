const passport = require('passport');
const express = require('express');
const pool = require('../database');
const { isNotLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('signup-view/signup');
});

router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login-view/login');
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

router.post('/login', async (req, res, next) => {
    const { cedula } = req.body;
    const cedulaLogin = {
        cedula
    }
    const userRole = await pool.query('SELECT role FROM users WHERE cedula = ?', [cedulaLogin.cedula]);

    if(userRole[0].role === 'user'){
        passport.authenticate('local.login', {
            successRedirect: '/user-data',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }else{
        passport.authenticate('local.login', {
            successRedirect: '/analist-data',
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }

})

module.exports = router