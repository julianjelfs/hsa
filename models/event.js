var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventVolunteer = new Schema({ 
  name: String,
  email : String,
  phone : String
});

var EventSlot = new Schema({ 
  required: Number,
  volunteers : [EventVolunteer]
});

var EventTask = new Schema({ 
  name: String,
  slots : [EventSlot]
});

var Event = new Schema({
  date : Date,
  start : String,
  end : String,
  title : String,
  description : String,
  requiresVolunteers : Boolean,
  timeSlots : Number,
  slotDuration : Number,
  tasks : [EventTask]
});

module.exports = mongoose.model('Event', Event);