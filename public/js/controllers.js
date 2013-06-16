'use strict';

/* Controllers */
function AppCtrl($scope, $location, $http) {

}

function ContactCtrl($scope, $http, $location){
  $scope.send = function(c){
    $http.post("/api/contact/send", {
      contact: $scope.contact
    }).success(function (result) {      
      $('#confirm').foundation('reveal', 'open');
    });
    
    $scope.closeConfirm = function(){
      $('#confirm').foundation('reveal', 'close');
      $location.path("/");
    }
  }
}

function SponsorsCtrl($scope) {
  $scope.sponsors = [{
    name : "Evergreen Loft Company", 
    website : "http://www.evergreenloft.co.uk/"
  }, {
    name : "Goodfellows Estate Agency", 
    website : "http://www.goodfellows.co.uk/"
  }, {
    name : "St Anthony's Hospital", 
    website : "http://www.stanthonys.org.uk"
  },{
    name : "Spar and Post Office",
    address: "340 Grand Drive",
    phone:"020 8543 9398",
    website : "http://www.spar.co.uk/"
  },{
    name : "MARTIN & CO", 
    website : "http://www.martinco.com"
  },{
    name : "SCI Products Ltd", 
    website : "http://www.sciwindows.co.uk/"
  },{
    name : "Fiesta Fitness", 
    website : "http://www.Fiestafitness.com"
  },{
    name : "Clothes Line",
    website :"http://www.youruniform.co.uk"
  },{
    name : "Interactive Laser Inks",
    website : "http://www.laser-inks.co.uk"
  },{
    name : "Dale Fencing Ltd",
    website : "http://www.dalefencing.co.uk"
  },{
    name : "Koi Water Gardens", 
    website : "http://www.koiwatergarden.com"
  },{
    name : "Stonecot Studios",
    website : "http://www.stonecotstudios.co.uk"
  },{
    name : "Grand Drive Computers",
    website : "http://www.granddrivecomputers.com/"
  }, {
    name : "Bowlane Pre-School", 
    website: "http://www.bowlanepre-school.co.uk"
  },{
    name : "Chelsea White Building Services", 
    phone: "020 86484033"
  },{
    name : "Imperial Pharmacy", 
    website : "http://www.imperialpharmacysutton.com/"
  },{
    name : "Paul Electrical Co Ltd", 
    address : "248/252 Grand Drive",
    phone : "020 85426546"
  },{
    name : "Wimbledon Racquets & Fitness Club", 
    website : "http://www.wimbledonclub.co.uk"
  },{
    name : "Morden Park Dental Practice", 
    website : "http://mordenparkdentalpractice.com/"
  },{
    name : "Kinleigh, Folkard & Hayward",
    website : "http://www.kfh.co.uk/"
  }]; 
}

function TeamCtrl($scope, $location){
  $scope.team = [{
    position : 'Chair',
    name : 'Nicky	Gray',
    description : "Nicky thinks she is in charge, and also Alan thinks he is in charge. I'm not sure who's in charge but Nicky scares me a bit",
    phone : '07729 773 885'
  },{
    position : 'Deputy Chair',
    name : 'Karen Wright',
    description : "Most unsuitable",
    phone : '07941 410 045'
  },{
    position : 'Treasurer',
    name : 'Kallina Jelfs',
    phone : '07747 064 621'
  }]; 
  
  $scope.contact = function(member){
    $location.path("/contact/" + member.name);  
  }
}

function LoginCtrl($scope, $http, authService) {
  $scope.submit = function() {
    $http.post('/api/login', {
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }
}


function RegisterCtrl($scope, $http, $location, authService) {
  $scope.submit = function() {
    $http.post('/api/register', {
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
      $location.path("/");
    });
  }  
}


function NewsItemCtrl($scope, circles) {
    $scope.circles = circles;
}

function NewNewsItemCtrl($scope, $http, $location){
    $scope.submit = function(){
        $http.post('/api/newsitem/create', {
            newsitem : $scope.newsitem
        }).success(function(data, status, headers, config) {
            $location.path('/newsitem/index');
        });
    }
}

function NewEventCtrl($scope, $http, $location){
  $scope.event = {
    tasks : [],
    slotDuration : 60,
    timeSlots : 0
  }; 
  
  $scope.timeSlotsArray = function(){
    var slots = $scope.event.timeSlots;
    var arr = [];
    for(var i=0; i<slots; i++) { arr.push(i); }
    return arr;
  };  
  
  function emptySlotsArray(){
    var arr = [];
    var slots = $scope.event.timeSlots;
    for(var i=0; i<slots; i++){
      arr.push({
        index : i,
        required : 0,
        volunteers :[]
      });
    }
    return arr;
  }
  
  $scope.removeTask = function(t){
    var index = $scope.event.tasks.indexOf(t)
    if(index >= 0)
      $scope.event.tasks.splice(index,1);   
  }
  
  $scope.rejigSlots = function(){
    //go through all tasks in the event and make sure we have the right number of slots. 
    angular.forEach($scope.event.tasks, function(val, key){
      
      if(val.slots.length < $scope.event.timeSlots){
        val.slots.push({
          index : val.slots.length,
          required : 0,
          volunteers :[]
        });    
      }
      if(val.slots.length > $scope.event.timeSlots){
        val.slots.splice(val.slots.length-1,1);
      }
    });
  }
  
  $scope.submit = function(){
        $http.post('/api/event/create', {
            event : $scope.event
        }).success(function(data, status, headers, config) {
            $location.path('/event/index');
        });
    }
        
    $scope.addTask = function() {
       if($scope.newTask == null || $scope.newTask.length == 0)
         return;
       
      $scope.event.tasks.push({
        name : $scope.newTask,
        slots : emptySlotsArray()
      });
      
      $scope.newTask = "";
    }
}

function HomeCtrl($scope, $timeout, $window){
  $scope.$on("$viewContentLoaded", function(){
    
  }); 
  
}
