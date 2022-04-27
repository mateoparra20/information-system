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

/**
 * Vista inicial del rol analista, inicia en la pestaña historial por default
 */
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
/**
 * Vista de la ruta para ver datos en vivo
 */
router.get('/analist-data-stream', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');
    res.render('analist-data-view/analist-data-stream', { users });
});
router.post('/analist-data-stream', (req, res) => {
    req.session.context = req.body;

    res.redirect('/analist-data-stream-chart');
});
router.get('/analist-data-stream-chart', async (req, res) => {
    var context=req.session.context;
    console.log(context);
    console.log(typeof context.timestamp);
    if(context.role !== '0'){
        const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');

        const measureFrecuencia = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=1 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.role, parseInt(context.timestamp)]);
        const measureTemperatura = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=3 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.role, parseInt(context.timestamp)]);
        const measureOxigenacion = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=2 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.role, parseInt(context.timestamp)]);
        res.render('analist-data-stream-view/stream-data', { users, measureFrecuencia, measureTemperatura, measureOxigenacion });
    }else{
        const users = await pool.query('SELECT u.user_id, u.identification, u.name, u.lastname FROM users u JOIN roles r ON u.role_id = r.role_id WHERE r.role = "user";');
        res.render('analist-data-view/analist-data-stream', { users })
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

router.get('/user-data-stream', isLoggedIn, (req, res) => {
    res.render('user-data-view/user-data-stream');
});
router.post('/user-data-stream', (req, res) => {
    req.session.context = req.body;
    res.redirect('/user-data-stream-chart');
});
router.get('/user-data-stream-chart', async(req,res) => {
    var context = req.session.context;
    console.log(context);

    const measureFrecuencia = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=1 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.identification, parseInt(context.timestamp)]);
    const measureTemperatura = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=3 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.identification, parseInt(context.timestamp)]);
    const measureOxigenacion = await pool.query('SELECT vs.measure, vs.time_record, v.vital_sign FROM vital_signs_users vs JOIN vital_signs v ON vs.vs_id = v.vs_id JOIN users u ON vs.user_id = u.user_id WHERE vs.vs_id=2 AND u.identification = ? order by vs.vs_user_id desc limit ? ', [context.identification, parseInt(context.timestamp)]);
    res.render('user-data-stream-view/stream-data', {measureFrecuencia, measureOxigenacion, measureTemperatura})
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