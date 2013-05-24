var passport = require('passport'),
    User = require('../models/user'),
    Circle = require('../models/circle'),
    Request = require('../models/request'),
    util = require('util');

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


    app.get('/api/requests', ensureAuthenticated, function (req, res) {
        Request.find(function (err, requests) {
            if (err) {
                res.send(500, err);
            }
            res.json(requests);
        })
    });

    app.get('/api/circles', ensureAuthenticated, function (req, res) {
        Circle.find(function (err, circles) {
            if (err) {
                res.send(500, err);
            }
            res.json(circles);
        })
    });

    app.post('/api/register', function (req, res) {
        User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
            if (err) {
                return res.json({
                    error: err
                });
            }
            res.json({
                user: user
            });
        });
    });

    app.post('/api/circle/delete/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        Circle.findById(id, function (err, c) {
            c.remove(function (err, c) {
                if (err) {
                    res.send(500, err);
                }
                res.send(200, "Deleted");
            });
        });
    });

    app.post('/api/request/delete/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        Request.findById(id, function (err, c) {
            c.remove(function (err, c) {
                if (err) {
                    res.send(500, err);
                }
                res.send(200, "Deleted");
            });
        });
    });

    app.post('/api/circle/edit/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        var c = req.body.circle;
        delete c._id;
        Circle.update({_id: id}, c, function (err, num) {
            if (err) {
                res.send(500, err);
            }
            res.send(200, "Updated " + num + " circles");
        });
    });

    app.post('/api/request/edit/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        var r = req.body.request;
        delete r._id;
        Request.update({_id: id}, r, function (err, num) {
            if (err) {
                res.send(500, err);
            }
            res.send(200, "Updated " + num + " requests");
        });
    });

    app.get('/api/circle/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        var c = Circle.findById(id, function (err, c) {
            if (err) {
                res.send(500, err);
            }
            res.json(c);
        });
    });

    app.get('/api/request/:id', ensureAuthenticated, function (req, res) {
        var id = req.params.id;
        var r = Request.findById(id, function (err, r) {
            if (err) {
                res.send(500, err);
            }
            res.json(r);
        });
    });

    app.post('/api/circle/create', ensureAuthenticated, function (req, res) {
        var c = new Circle({
            name: req.body.name,
            description: req.body.description
        });
        c.save(function (err, c) {
            if (err) {
                return res.send(500, err);
            }
            res.send(200, "Circle added");
        })
    });

    app.post('/api/request/create', ensureAuthenticated, function (req, res) {
        var r = new Request(req.body.request);
        r.save(function (err, r) {
            if (err) {
                return res.send(500, err);
            }
            res.send(200, "Request added");
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
        res.send(200, "Logged in as " + req.user.username);
    });

    app.get("*", function (req, res) {
        res.render('index');
    });

};