var User = require('../models/user'),
    uuid = require('node-uuid'),
    emailer = require("../utils/emailer")
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
          admin : user.admin,
          loggedIn : true
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
    admin : req.user.admin,
    loggedIn : true
  });      
};
 
exports.forgot = function(req, res, port) {
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
    var link = req.protocol + "://" + req.host + ":" + port + "/reset/" + token;
    console.log(link);
    emailer.sendResetToken( {
      email : username,
      link : link
    }, function(err){
      if(err)
        res.send(500, "Failed to send reset email: "+ err);
      else
        res.send(200, 'Reset instructions sent');    
    });    
  }); 
};

exports.requestReset = function(req, res){
  var token = req.params.token;
  User.findOne({
    resetToken : token
  }, function(err, user){
    res.json({
      username : user.username,
      resetToken : user.resetToken
    });
  });
}

exports.doReset = function(req, res){
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