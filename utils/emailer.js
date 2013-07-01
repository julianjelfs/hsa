var SendGrid = require('sendgrid').SendGrid;
var sendgrid = new SendGrid(process.env.SENDGRID_USER, process.env.SENDGRID_PASSWORD);

var all = 1;

var recipients = {
  NickyGray : {
    email : "Nicola_gray@blueyonder.co.uk",
    flag : 2
  },
  KarenWright : {
    email : "karenjwright@blueyonder.co.uk",
    flag : 4  
  },
  KallinaJelfs : {
    email : "kallina.jelfs@gmail.com",
    flag : 8
  }
}

function buildToList (contact){
  var to = [];
  var flag = parseInt(contact.to);
  var sendAll = (all & flag) === all;
  for(var prop in recipients) {
    if(sendAll || (recipients[prop].flag & flag) === recipients[prop].flag ) {
      to.push(recipients[prop].email);
    }
  }
  return to;
}

exports.send = function(contact, success, failure) {
  sendgrid.send({
    to: buildToList(contact),
    from: contact.email,
    subject: 'Query from ' + contact.name  + ' via the HSA website',
    bcc : ["julian.jelfs@gmail.com"],
    text: contact.message
  }, function(ok, message) {
    if (!ok) {
      failure(message);    
    } else {
      success();
    }    
  });
  
}