const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

// Proceso de SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'cedula',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, cedula, password, done) => {
    const { email, name, lastname, birthday, phone, role, gender } = req.body;
    const newUser = {
        cedula,
        password,
        email,
        name,
        lastname,
        birthday,
        phone,
        role,
        gender
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

//Proceso de LOGIN
passport.use('local.login', new LocalStrategy({
    usernameField: 'cedula',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, cedula, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE cedula = ?', [cedula]);
    if(rows.length > 0){
        const user = rows[0];
        const validPawd = await helpers.matchPassword(password, user.password);
        if(validPawd){
            done(null, user, req.flash('success', 'Bienvenido de nuevo ' + user.name + ' ' + user.lastname));
        }
        else {
            done(null, false, req.flash('message', 'Contraseña invalida! Inténtalo de nuevo'));
        }
    }
    else {
        return done(null, false, req.flash('message', 'La cédula no existe! Por favor regístrate'));
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});