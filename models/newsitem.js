var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NewsItem = new Schema({
    title : String,
    summary : String,
    description : String,
    date : Date
});

module.exports = mongoose.model('NewsItem', NewsItem);