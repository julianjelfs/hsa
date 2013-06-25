'use strict';

/* Services */
angular.module('myApp')
  .factory("timeParsing", function(){
  function parseToMinutes(timeString) {
    if(timeString == null || timeString.length == 0)
      return 0;
    var match = timeString.match(/(\d{2}):(\d{2})/);
    var hr = parseInt(match[1]);
    var min = parseInt(match[2]);
    return hr * 60 + min;
  }
  function minutesToString(mins){
    var hrs = mins / 60;
    var h = Math.floor(hrs);
    var m = ((hrs - h) * 60).toFixed(0);
    return h  + ":" + (m < 10 ? "0" + m : m);
  }
  
  return {
    slotsArray : function(slots, duration, start){
      var arr = [];
      var s = parseToMinutes(start);
      for(var i=0; i<slots; i++) { 
        arr.push({
          start : minutesToString(s + (i * duration)),
          end : minutesToString(s + (i * duration) + duration)
        });
      }  
      return arr;
    }
  }
}).factory("contact", function(){
  return {
    All : {
      name : "All HSA Members",
      flag : 1
    },
    NickyGray : {
      position : 'Chair',
      name : 'Nicky	Gray',
      description : "Nicky thinks she is in charge, and also Alan thinks he is in charge. I'm not sure who's in charge but Nicky scares me a bit",
      phone : '07729 773 885',
      flag : 2
    },
    KarenWright : {
      position : 'Deputy Chair',
      name : 'Karen Wright',
      description : "Most unsuitable",
      phone : '07941 410 045',
      flag : 4  
    },
    KallinaJelfs : {
      position : 'Treasurer',
      name : 'Kallina Jelfs',
      phone : '07747 064 621',
      flag : 8
    }    
  }
});

