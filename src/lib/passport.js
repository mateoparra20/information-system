const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

// SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'cedula',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, cedula, password, done) => {
    const { email, name, lastname, birthday, phone, role } = req.body;
    const newUser = {
        cedula,
        password,
        email,
        name,
        lastname,
        birthday,
        phone,
        role
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});