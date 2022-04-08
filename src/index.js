const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');
const passport = require('passport');

const server = express();
const { database } = require('./keys');

// SETTINGS
const PORT = process.env.PORT || 2000;
server.set('views', path.join(__dirname, 'views'));
server.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(server.get('views'), 'layouts'),
    partialsDir: path.join(server.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
server.set('view engine', '.hbs');

//MIDDLEWARES
server.use(morgan('dev'));
server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(session({
    secret: 'tesissession',
    resave: 'false',
    saveUninitialized: 'false',
    store: new mysqlStore(database)
}));
server.use(flash());
server.use((req, res, next) => {
    server.locals.success = req.flash('success')
    next();
});

// RUTAS
server.use(require('./routes/routes'));
server.use(require('./routes/authentication'));

//PUBLIC
server.use(express.static(path.join(__dirname, 'public')))

//START SERVER
server.listen(PORT, () => {
    console.log(`Server on port ${PORT}`)
});