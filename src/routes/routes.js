const express = require('express');
const pool = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('home-view/home')
});

router.get('/user-data', (req, res) => {
    res.render('user-data-view/user-data');
});

router.get('/analist-data', async (req, res) => {
    const role = 'user';
    users = await pool.query('SELECT name, lastname FROM users WHERE role = "user";');
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

module.exports = router