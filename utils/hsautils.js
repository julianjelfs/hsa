var pageSize = 5;

exports.getUser = function(req){
    return req.isAuthenticated() ? {
        username : req.user.username,
        loggedIn : true,
        admin : req.user.admin
    } : {
        username : "Log In",
        loggedIn : false,
        admin : false
    }
}

exports.pageSize = pageSize;

exports.pageQuery = function (req, q){
  var page = req.params.page;
  if(page!=null){
    q.skip(page * pageSize)
    .limit(pageSize);
  }
  return q;
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.send(401, 'Unauthorized');
}

exports.ensureAdmin = function(req, res, next) {
    if (req.isAuthenticated() && req.user.admin) {
        return next();
    }
    res.send(401, 'Unauthorized');
}