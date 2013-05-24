var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Circle = new Schema({
    name : String,
    description : String
});

module.exports = mongoose.model('Circle', Circle);