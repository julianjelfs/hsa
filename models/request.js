var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Request = new Schema({
    date : Date,
    start : String,
    end : String,
    description : String
});

module.exports = mongoose.model('Request', Request);