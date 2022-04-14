const express = require('express');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('home-view/home')
});
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});

router.get('/user-data', isLoggedIn, (req, res) => {
    res.render('user-data-view/user-data');
});

router.get('/analist-data', isLoggedIn, async (req, res) => {
    users = await pool.query('SELECT u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');
    res.render('analist-data-view/analist-data', { users });
});

router.post('/user-data', (req, res) => {
    const { selectedDate } = req.body;
    const userSelectedDate = {
        selectedDate,
    }
    console.log('selected date', userSelectedDate);
    /**
     * SELECCIONAR FECHA DE LA BASE DE DATOS
     * Y MOSTRAR EL RESULTADO EN GOOGLE CHARTS
     */
    if(userSelectedDate.selectedDate === '2022-04-04'){
        req.flash('success', 'Listones');
    }
    res.redirect('/user-data');
});

router.post('/analist-data', (req, res) => {
    /**
     * SELECCIONAR FECHA DE LA BASE DE DATOS
     * Y MOSTRAR EL RESULTADO EN GOOGLE CHARTS
     */

    res.redirect('/analist-data');
});

module.exports = router