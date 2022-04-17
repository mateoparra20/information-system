const express = require('express');
const moment = require('moment');
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
    const vitalSign = await pool.query('SELECT vs_id FROM vital_signs');

    const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');
    const measureFrecuencia = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id WHERE vs.time_record <= "2022-04-16 19:42:23" AND vs.vs_id=1');
    const measureTemperatura = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id WHERE vs.time_record <= "2022-04-16 19:42:23" AND vs.vs_id=3');
    const measureOxigenacion = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id WHERE vs.time_record <= "2022-04-16 19:42:23" AND vs.vs_id=2');

    res.render('analist-data-view/analist-data', { users, measureFrecuencia, measureTemperatura, measureOxigenacion });
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
    console.log(req.body);

    res.redirect('/analist-data');
});

module.exports = router


/**
 * LO DEJE ACA PORQUE A MI NO ME APARECE LA OPCIÓN DE MINIMIZAR XD
// console.log(users);
// console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
// const new_vs_u = {
//     user_id : null,
//     vs_id: null,
//     measure: null,
//     time_record: null
// };

// for (let step = 0; step < 50; step++) {
//     var u = Math.floor(Math.random() * users.length);
//     var L = Math.floor(Math.random() * 3);
//     var M = Math.floor(Math.random() * 100);
//     // console.log(users[u].user_id);
//     // console.log(vitalSign[L].vs_id);
//     new_vs_u.user_id = users[u].user_id;
//     new_vs_u.vs_id = vitalSign[L].vs_id;
//     new_vs_u.measure = parseFloat(M);
//     new_vs_u.time_record = moment().format('YYYY-MM-DD HH:mm:ss');
//     const result_sv_u = await pool.query('INSERT INTO vital_signs_users SET ?', [new_vs_u]);
    // setTimeout(() => {
    //     console.log("1 Segundo esperado")
    //   }, 2000);
    // console.log(result_sv_u);
// }
*/