var utils = require('../utils/hsautils'),
    Event = require('../models/event');

exports.index = function (req, res) {
  var today = new Date();
  
  Event.count(null, function(err, count){
    if (err) {
      res.send(500, err);
    }
    
    Event.where('date').lt(today).remove(function(){
      utils.pageQuery(req, Event.find()
                .select('date start end title description requiresVolunteers')
                .sort({ date : 'asc', start : 'asc' }))
      .where('date').gte(new Date())
      .exec(function (err, events) {
        if (err) {
          res.send(500, err);
        }
        res.json({
          events : events,
          total : count,
          pageSize : utils.pageSize
        });
      });
    });
  });
}

exports.delete = function(req, res) {
  Event.findById(req.params.id, function (err, n) {
    n.remove(function (err, n) {
      if (err) {
        res.send(500, err);
      }
      res.send(200, "Deleted Event");
    });
  });
}

exports.update = function (req, res) {
  var m = req.body.event;
  delete m._id;
  Event.update({_id: req.params.id}, m, function (err, num) {
    if (err) {
      res.send(500, err);
    }
    res.send(200, "Updated " + num + " events");
  });
}

exports.view = function (req, res) {
  Event.findById(req.params.id, function (err, m) {
    if (err) {
      res.send(500, err);
    }
    res.json(m);
  });
}

exports.create = function (req, res) {
  var m = new Event(req.body.event);
  m.save(function (err, m) {
    if (err) {
      return res.send(500, err);
    }
    res.send(200, "Event added");
  })
}