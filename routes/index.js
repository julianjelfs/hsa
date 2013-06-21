var passport = require('passport'),
    User = require('../models/user'),
    NewsItem = require('../models/newsitem'),
    Event = require('../models/event'),
    util = require('util'),
    pageSize = 5;

function ensureAuthenticated(req, res, next) {
    if (req.user)
        util.puts('User is authenticated ' + req.user.username);

    if (req.isAuthenticated()) {
        return next();
    }

    res.send(401, 'Unauthorized');
}


module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    app.get('/partials/:area/:name', function (req, res) {
        var name = req.params.name;
        var area = req.params.area;
        res.render('partials/' + area + '/' + name);
    });


    app.post('/api/register', function (req, res) {
        User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
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
                  user: user
              });
            });
            
        });
    });

    var models = {
        "newsitem" : NewsItem,
        "event" : Event
    };
  
  function pageQuery(req, q){
    var page = req.params.page;
    if(page!=null){
       q.skip(page * pageSize)
        .limit(pageSize);
    }
    return q;
  }

  app.get('/api/events/:page?', function (req, res) {
    
    Event.count(null, function(err, count){
      if (err) {
        res.send(500, err);
      }
      
      pageQuery(req, Event.find()
        .select('date start end title description requiresVolunteers')
        .sort({ date : 'asc', start : 'asc' }))
        .exec(function (err, events) {
              if (err) {
                  res.send(500, err);
              }
            res.json({
              events : events,
              total : count,
              pageSize : pageSize
            });
          });
      });
    });
    
    
  
  app.get('/api/newsitems/:page?', function (req, res) {
    NewsItem.count(null, function(err, count){
      if (err) {
        res.send(500, err);
      }      
      pageQuery(req, NewsItem.find().sort('-date'))
        .exec(function (err, models) {
          if (err) {
            res.send(500, err);
          }
          res.json({
              items : models,
              total : count,
              pageSize : pageSize
            });
        });
      });
    });

    app.post('/api/:model/delete/:id', ensureAuthenticated, function (req, res) {
        var model = models[req.params.model];
        model.findById(req.params.id, function (err, m) {
            m.remove(function (err, m) {
                if (err) {
                    res.send(500, err);
                }
                res.send(200, "Deleted " + req.params.model);
            });
        });
    });

    app.post('/api/:model/edit/:id', ensureAuthenticated, function (req, res) {
        var model = models[req.params.model];
        var m = req.body[req.params.model];
        delete m._id;
        model.update({_id: req.params.id}, m, function (err, num) {
            if (err) {
                res.send(500, err);
            }
            res.send(200, "Updated " + num + " " + req.params.model);
        });
    });

    app.get('/api/:model/:id', function (req, res) {
        models[req.params.model].findById(req.params.id, function (err, m) {
            if (err) {
                res.send(500, err);
            }
            res.json(m);
        });
    });
  
  app.post('/api/contact/send', function(req, res) {
    var msg = req.params.contact;
    res.send(200, "message sent successfully");
  });

    app.post('/api/:model/create', ensureAuthenticated, function (req, res) {
        var model = models[req.params.model];
        var m = new model(req.body[req.params.model]);
        m.save(function (err, m) {
            if (err) {
                return res.send(500, err);
            }
            res.send(200, req.params.model + " added");
        })
    });

    app.post('/api/logout', function (req, res) {
        if (req.user)
            util.puts('Logging out user' + req.user.username);
        req.session.destroy();
        req.logout();
        delete req['user'];
        res.send(200, 'Logged out');
    });

    app.post('/api/login', passport.authenticate('local'), function (req, res) {
        util.puts("logged in as " + req.user.username);
      res.send(200, {
        username : req.user.username
      });      
    });
  
  app.get('/api/search/users/:prefix', ensureAuthenticated, function(req, res){
    var prefix = req.params.prefix;
    User.find({ username: { $regex: prefix, $options: 'i' }}, function(err, users){
      if(err) {
        return res.send(500, err);
      }
      return res.json(users);
    });
  });

    app.get("*", function (req, res) {
        res.render('index');
    });

};