var util = require("../utils/hsautils")

exports.partials = function(req, res) {
  var name = req.params.name;
  var area = req.params.area;
  res.render('partials/' + area + '/' + name, {user :util.getUser(req)});
}

exports.index = function (req, res) {
    res.render('index', {user : util.getUser(req)});
}