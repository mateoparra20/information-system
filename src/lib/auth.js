const pool = require('../database');

module.exports = {

    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        return res.redirect('/');
    },

    async isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()){
            return next()
        }
        console.log(req.user.user_id)
        const role = await pool.query('SELECT r.role FROM users u JOIN roles r ON u.role_id = r.role_id WHERE u.user_id=?', [req.user.user_id]);
        console.log(role)
        if(role[0].role === 'user'){
            return res.redirect('/user-data');
        }else{
            return res.redirect('/analist-data');
        }
        // return res.redirect('/profile')
    }
}