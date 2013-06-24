
exports.send = function(req, res) {
  var msg = req.params.contact;
  res.send(200, "message sent successfully");
}