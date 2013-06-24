var User = require('../models/user'),
    util = require('util');

exports.register = function (req, res) {
  User.register(new User({ username: req.body.username, admin : false }), req.body.password, function (err, user) {
    if (err) {
      return res.json({
        error: err
      });
    }
    req.login(user, function(err) {
      if (err) { 
        return res.json({
          error: err
        }); 
      }
      return res.json({
        user: {
          username : user.username,
          admin : user.admin
        }
      });
    });
    
  });
}

exports.logout = function (req, res) {
  if (req.user)
    util.puts('Logging out user' + req.user.username);
  req.session.destroy();
  req.logout();
  delete req['user'];
  res.send(200, 'Logged out');
};

exports.login = function (req, res) {
  util.puts("logged in as " + req.user.username);
  res.send(200, {
    username : req.user.username,
    admin : req.user.admin
  });      
};
 
exports.forgot = function(req, res) {
  var username = req.body.username;
  if(username == null){
    return res.send(500, 'missing username from request');  
  }
  
  var token = uuid.v4();
  util.puts(username + " forgot their password, generated token " + token);
  
  User.update({ 
    username: username 
  }, {
    resetToken : token,
    resetTokenCreated : new Date()
  }, function (err, count){
    res.send(200, 'Reset instructions sent');  
  }); 
};

exports.reset = function(req, res){
  var model = req.body.model;
  User.findOne({
    resetToken : model.token
  }, function(err, user){
    user.setPassword(model.password, function(){
      delete user.resetToken;
      delete user.resetTokenCreated;
      user.save(function(){
        res.send(200, 'Password reset successfully');  
      });
    });  
  });
};