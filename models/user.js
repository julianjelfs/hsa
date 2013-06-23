var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  name : String,
  admin : Boolean,
  resetToken : String,
  resetTokenCreated : Date 
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);