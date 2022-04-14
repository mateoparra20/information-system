const passport = require('passport');
const express = require('express');
const pool = require('../database');
const { isNotLoggedIn } = require('../lib/auth');

const router = express.Router();

/**
 * Rutas GET y POST para el endpoint /signup
 */
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('signup-view/signup');
});
router.post('/signup', (req, res, next) => {
    const { role } = req.body;
    // const roleSelected = {
    //     role
    // }
    if(role === 'user'){
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

/**
 * Rutas GET y POST para el endpoint /login
 */
router.get('/login', isNotLoggedIn, (req, res) => {
    res.render('login-view/login');
});
router.post('/login', async (req, res, next) => {
    const { identification } = req.body;

    //const userRole = await pool.query('SELECT role FROM users WHERE cedula = ?', [cedula]);
    const userRole = await pool.query('SELECT r.role FROM roles r JOIN users u ON r.role_id = u.role_id WHERE u.identification=?',[identification]);

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