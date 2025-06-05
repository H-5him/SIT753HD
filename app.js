// Load DB and modules
require('./typeorm-db'); // If you're using TypeORM for MySQL

const express = require('express');
const http = require('http');
const path = require('path');
const session = require('express-session');
const methodOverride = require('method-override');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const marked = require('marked');
const fileUpload = require('express-fileupload');
const st = require('st');
const ejsEngine = require('ejs-locals');
const cons = require('consolidate');
const hbs = require('hbs');
const dust = require('dustjs-linkedin');
const dustHelpers = require('dustjs-helpers');

// Routes
const routes = require('./routes');
const routesUsers = require('./routes/users.js');

const app = express();

// View Engine Setup
app.set('port', process.env.PORT || 3001);
app.engine('ejs', ejsEngine);
app.engine('dust', cons.dust);
app.engine('hbs', hbs.__express);
cons.dust.helpers = dustHelpers;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  name: 'connect.sid',
  cookie: { path: '/' }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// Markdown rendering
marked.setOptions({ sanitize: true });
app.locals.marked = marked;

// Static files
app.use(st({ path: './public', url: '/public' }));

// Development error handler
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

// Custom Middleware for current user session
app.use(routes.current_user);

// App routes
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginHandler);
app.get('/admin', routes.isLoggedIn, routes.admin);
app.get('/account_details', routes.isLoggedIn, routes.get_account_details);
app.post('/account_details', routes.isLoggedIn, routes.save_account_details);
app.get('/logout', routes.logout);
app.post('/create', routes.create);
app.get('/destroy/:id', routes.destroy);
app.get('/edit/:id', routes.edit);
app.post('/update/:id', routes.update);
app.post('/import', routes.import);
app.get('/about_new', routes.about_new);
app.get('/chat', routes.chat.get);
app.put('/chat', routes.chat.add);
app.delete('/chat', routes.chat.delete);
app.use('/users', routesUsers);

// GitHub Webhook Route
app.post('/github-webhook', express.json(), (req, res) => {
  console.log('📬 GitHub webhook received:');
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Secret token (if needed elsewhere in the app)
const token = 'SECRET_TOKEN_f8ed84e8f41e4146403dd4a6bbcea5e418d23a9';
console.log('token: ' + token);

// Start server
http.createServer(app).listen(app.get('port'), () => {
  console.log('✅ Express server listening on port ' + app.get('port'));
});
