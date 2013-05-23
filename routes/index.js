var passport = require('passport'), 
    User = require('../models/user');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401, 'Unauthorized');
}

module.exports = function (app) {
  
  app.get('/', function(req, res){
    res.render('index');
  });
  
  app.get('/partials/:area/:name', function (req, res) {
    var name = req.params.name;
    var area = req.params.area;
    res.render('partials/' + area + '/' + name);
  });
  
  app.get('/api/requests', ensureAuthenticated, function(req, res) {
    res.json([{
      description : 'Request One'
    },{
      description : 'Request Two'
    },{
      description : 'Request Three'
    },{
      description : 'Request Four'
    },{
      description : 'Request Five'
    }]);
  });
  
  app.post('/api/register', function(req, res) {
    User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
      if (err) {
        return res.json({
          error : err
        });
      }
      res.json({
        user : user  
      });
    });
  });
  
  app.post('/api/logout', function(req, res){
    req.logout();
    res.send(200, 'Logged out');
  });
  
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.json({
      user : 'hurrah'  
    });
  });
};