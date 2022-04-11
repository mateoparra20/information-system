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
        const role = await pool.query('SELECT role FROM users WHERE id=?', [req.user.id]);
        
        if(role[0].role === 'user'){
            return res.redirect('/user-data');
        }else{
            return res.redirect('/analist-data');
        }
        // return res.redirect('/profile')
    }
}