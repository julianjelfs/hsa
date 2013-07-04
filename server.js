var express = require('express'),
  accountRoutes = require('./routes/account'),
  staticRoutes = require('./routes/static'),
  contactRoutes = require('./routes/contact'),
  newsRoutes = require('./routes/news'),
  eventsRoutes = require('./routes/events'),
  galleryRoutes = require('./routes/gallery'),
  mongoose = require('mongoose'),
  passport = require('passport'), 
  LocalStrategy = require('passport-local').Strategy,
  utils = require('./utils/hsautils'),
  gzippo = require('gzippo'),
  emailer = require("./utils/emailer");

var port = process.env.PORT || 3000;
var app = module.exports = express();
var server = require('http').createServer(app);
server.listen(port, function(){
    console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());  
  app.use(gzippo.staticGzip(__dirname + '/public'));
  app.use(express.cookieParser()); 
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.favicon("public/images/favicon.ico"));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

//configure passport
var User = require('./models/user');
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGODB_HSA_URI);

// Routes
app.post('/api/register', accountRoutes.register);
app.post('/api/logout', accountRoutes.logout);
app.post('/api/login', passport.authenticate('local'), accountRoutes.login);
app.post("/api/forgot", accountRoutes.forgot);
app.get('/api/reset/:token', accountRoutes.requestReset);
app.post('/api/reset', accountRoutes.doReset);
app.post('/api/contact/send', contactRoutes.send);

app.get('/api/newsitems/:page?', newsRoutes.index);
app.post('/api/newsitem/delete/:id', utils.ensureAdmin, newsRoutes.delete);
app.post('/api/newsitem/edit/:id', utils.ensureAuthenticated, newsRoutes.update);
app.get('/api/newsitem/:id', newsRoutes.view);
app.post('/api/newsitem/create', utils.ensureAdmin, newsRoutes.create); 

app.get('/api/events/:page?', eventsRoutes.index);
app.post('/api/event/delete/:id', utils.ensureAdmin, eventsRoutes.delete);
app.post('/api/event/edit/:id', utils.ensureAuthenticated, eventsRoutes.update);
app.get('/api/event/:id', eventsRoutes.view);
app.post('/api/event/create', utils.ensureAdmin, eventsRoutes.create);

app.post("/gallery/upload/:name", utils.ensureAdmin, galleryRoutes.upload);

app.get('/partials/:area/:name', staticRoutes.partials);

app.get("/email/test", emailer.test);
app.get('/', staticRoutes.index);

//belt and braces
app.get("*", function (req, res) {
  res.render('index', {user : utils.getUser(req)});
});

// redirect all others to the index (HTML5 history)
//app.get('*', routes.index);

