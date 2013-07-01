var emailer = require("../utils/emailer");

exports.send = function(req, res) {
  emailer.send(req.body.contact, function(){
     res.send(200, "email sent");  
  }, function(err){
    res.send(500, err);  
  });
}