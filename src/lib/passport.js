const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

// Proceso de SIGNUP
passport.use('local.signup', new LocalStrategy({
    usernameField: 'identification',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, identification, password, done) => {
    const { email, name, lastname, birthday, phone, role, gender } = req.body;

    const roleId = await pool.query('SELECT role_id FROM roles WHERE role=?', [role]);

    const newUser = {
        identification,
        password,
        email,
        name,
        lastname,
        birthday,
        phone,
        role_id: roleId[0].role_id,
        gender
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.user_id = result.insertId;
    return done(null, newUser);
}));

//Proceso de LOGIN
passport.use('local.login', new LocalStrategy({
    usernameField: 'identification',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, identification, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE identification = ?', [identification]);
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
    done(null, user.user_id);
});
passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);
    done(null, rows[0]);
});