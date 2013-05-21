
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function (req, res) {
  var name = req.params.name;
  var area = req.params.area;
  res.render('partials/' + area + '/' + name);
};