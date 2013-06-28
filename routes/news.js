var utils = require('../utils/hsautils'),
    NewsItem = require('../models/newsitem'),
    sleep = require('sleep');

exports.index = function (req, res) {
  NewsItem.count(null, function(err, count){
    if (err) {
      res.send(500, err);
    }      
    utils.pageQuery(req, NewsItem.find().sort('-date'))
    .exec(function (err, models) {
      if (err) {
        res.send(500, err);
      }
      res.json({
        items : models,
        total : count,
        pageSize : utils.pageSize
      });
    });
  });
}

exports.delete = function(req, res) {
  NewsItem.findById(req.params.id, function (err, n) {
    n.remove(function (err, n) {
      if (err) {
        res.send(500, err);
      }
      res.send(200, "Deleted News Item");
    });
  });
}

exports.update = function (req, res) {
  var m = req.body.newsitem;
  delete m._id;
  NewsItem.update({_id: req.params.id}, m, function (err, num) {
    if (err) {
      res.send(500, err);
    }
    res.send(200, "Updated " + num + " news items");
  });
}

exports.view = function (req, res) {
  NewsItem.findById(req.params.id, function (err, m) {
    if (err) {
      res.send(500, err);
    }
    res.json(m);
  });
}

exports.create = function (req, res) {
  var m = new NewsItem(req.body.newsitem);
  m.save(function (err, m) {
    if (err) {
      return res.send(500, err);
    }
    res.send(200, "News item added");
  })
}

