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
        moment.locale('de')
        modelSignalDb.time_record = moment.format('YYYY-MM-DD HH:mm:ss:SSS');
        await pool.query('SET @@auto_increment_increment=1');
        await pool.query('INSERT INTO vital_signs_users SET ?', [modelSignalDb]);
    }
}

module.exports = vitalSignalDb