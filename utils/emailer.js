var SendGrid = require('sendgrid').SendGrid;

exports.test = function(req, res){
  var sendgrid = new SendGrid(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);
  sendgrid.send({
    to: 'julian.jelfs@gmail.com',
    from: 'webmaster@hatfeildschoolassociation.co.uk',
    subject: 'Hello World',
    text: 'My first email through SendGrid'
  }, function(success, message) {
    if (!success) {
      console.log(message);
      res.send(500, message);      
    } else {
      res.send(200, "email sent"); 
    }    
  });
    
}