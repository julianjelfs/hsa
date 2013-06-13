var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Event = new Schema({
    date : Date,
    start : String,
    end : String,
    title : String,
    summary : String,
    description : String
});

module.exports = mongoose.model('Event', Event);