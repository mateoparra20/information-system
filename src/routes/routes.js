const express = require('express');
const moment = require('moment');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const router = express.Router();


router.get('/', isNotLoggedIn, (req, res) => {
    moment.locale('de')
    console.log(moment().format('YYYY-MM-DD HH:mm:ss:SSS'))
    res.render('home-view/home')
});
router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});

router.get('/analist-data', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');
    res.render('analist-data-view/analist-data', { users });
});
router.post('/analist-data', (req, res) => {
    req.session.context = req.body;

    res.redirect('/analist-data-chart');
});
router.get('/analist-data-chart', async (req, res) => {
    var context=req.session.context;
    console.log(context);
    if(context.role !== '0'){
        const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');

        const measureFrecuencia = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=1 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.role]);
        const measureTemperatura = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=3 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.role]);
        const measureOxigenacion = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=2 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.role]);
        let startdate = context.selectedStartDate;
        let enddate =  context.selectedEndDate;
        res.render('analist-data-history-view/history-data', { users, measureFrecuencia, measureTemperatura, measureOxigenacion, startdate , enddate });
    }else{
        const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');

        res.render('analist-data-view/analist-data', { users })
    }

    
});


router.get('/user-data', isLoggedIn, (req, res) => {
    res.render('user-data-view/user-data');
});
router.post('/user-data', (req, res) => {
    req.session.context = req.body;
    res.redirect('/user-data-chart');
});
router.get('/user-data-chart', async(req,res) => {
    var context = req.session.context;
    console.log(context);

    const measureFrecuencia = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=1 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.identification]);
    const measureTemperatura = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=3 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.identification]);
    const measureOxigenacion = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.time_record >= ? AND vs.time_record <= ? AND vs.vs_id=2 AND u.identification = ? ', [context.selectedStartDate, context.selectedEndDate, context.identification]);
    let startdate = context.selectedStartDate;
    let enddate =  context.selectedEndDate;
    res.render('user-data-history-view/history-data', {measureFrecuencia, measureOxigenacion, measureTemperatura, startdate, enddate})
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
//     new_vs_u.time_record = moment.utc().format('YYYY-MM-DD HH:mm:ss');
//     const result_sv_u = await pool.query('INSERT INTO vital_signs_users SET ?', [new_vs_u]);
    // setTimeout(() => {
    //     console.log("1 Segundo esperado")
    //   }, 2000);
    // console.log(result_sv_u);
// }
*/