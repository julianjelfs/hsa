'use strict';

/* Services */
var module = angular.module('myApp.services', []);
module.factory("contact", function(){
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

