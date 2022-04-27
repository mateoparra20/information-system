require('dotenv');
const client = require('twilio')("AC24d6cbd97e4536d4b5b1e797752ff69c", "848e9343dde7d345f47954f6cc96b78b");

const pool = require('../database');
const moment = require('moment');

modelSignalDb = {
    user_id : null,
    vs_id: null,
    measure: null,
    time_record: null
};

modelAlertDb = {
    user_id : null,
    anomaly_id: null,
    time_record: null
}
const vitalSignalDb = {
    registrar: async function( modelSignalDb ){
        
        let anomaliesQuery = null;
        moment.locale('de');
        modelSignalDb.time_record = moment().format('YYYY-MM-DD HH:mm:ss:SSS');
        await pool.query('SET @@auto_increment_increment=1');
        await pool.query('INSERT INTO vital_signs_users SET ?', [modelSignalDb]);
        
        anomaliesQuery = await pool.query('SELECT anomaly_id, description FROM anomalies WHERE vs_id = ? AND max_rate > ? AND min_rate < ?',[modelSignalDb.vs_id,modelSignalDb.measure,modelSignalDb.measure] );

        if (anomaliesQuery[0] !== undefined){
            let analist = await pool.query('SELECT phone, name FROM users WHERE role_id="2"');
            let user = await pool.query('SELECT phone, name FROM users WHERE user_id = ?', [modelSignalDb.user_id]);

            analist.forEach(element => {
                console.log('celular analistas', element.phone)
                client.messages.create({
                    from: 'whatsapp:+14155238886',
                    body: 'Hola analista ' + element.name +', según nuestro reporte, el usuario ' + user[0].name + ' presenta la anomalía '+ anomaliesQuery[0].description +' según sus signos vitales, ponte en contacto con el usuario inmediatamente',
                    to: 'whatsapp:+57' + element.phone,
                }).then(message => console.log(message.sid));
            });
            console.log('celular usuario', user[0].phone);
            client.messages.create({
                from: 'whatsapp:+14155238886',
                body: 'Hola usuario ' + user[0].name + ', según nuestro reporte, presentas la anomalía '+ anomaliesQuery[0].description +' según tus signos vitales, ponte en contacto con cualquier analista inmediatamente',
                to: 'whatsapp:+57' + user[0].phone,
            }).then(message => console.log(message.sid));

            modelAlertDb.time_record = modelSignalDb.time_record;
            modelAlertDb.user_id = modelSignalDb.user_id;
            modelAlertDb.anomaly_id = anomaliesQuery[0].anomaly_id;
            await pool.query('SET @@auto_increment_increment=1');
            await pool.query('INSERT INTO alert_history SET ?', [modelAlertDb]);
        }
    }
}

module.exports = vitalSignalDb