const pool = require('../database');
const moment = require('moment');

modelSignalDb = {
    user_id : null,
    vs_id: null,
    measure: null,
    time_record: null
}
const vitalSignalDb = {
    registrar: async function( modelSignalDb ){
        modelSignalDb.time_record = moment().format('YYYY-MM-DD HH:mm:ss:SSS');
        await pool.query('INSERT INTO vital_signs_users SET ?', [modelSignalDb]);
    }
}

module.exports = vitalSignalDb