'use strict';

/* Controllers */
function AppCtrl($scope, $location, $http) {

}

function ContactCtrl($scope, $http, $routeParams, $location, contact){
  var flag = 1;
  if($routeParams.flag != null) {
    flag = parseInt($routeParams.flag);
  }
  $scope.to = [];
  $scope.members = [];
  
  for(var prop in contact) {
    if((contact[prop].flag & flag) === contact[prop].flag) {
      $scope.to.push(contact[prop]);
    } else {
      $scope.members.push(contact[prop]);  
    }
  }
  
  $scope.addRecipient = function(m){
    $scope.to.push(m);
    var i = $scope.members.indexOf(m);
    if(i >= 0)
      $scope.members.splice(i,1);
  }
  
  $scope.removeRecipient = function(m){
    $scope.members.push(m);
    var i = $scope.to.indexOf(m);
    if(i >= 0)
      $scope.to.splice(i,1);
  }
  
  $scope.send = function(c) {
    $scope.contact.to = 0;
    angular.forEach($scope.to, function(t){
        $scope.contact.to = $scope.contact.to | t.flag;
    });
    
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
  
  (function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
  })($scope.sponsors);
}

function TeamCtrl($scope, $location, contact){
  $scope.team = [contact.NickyGray,contact.KarenWright, contact.KallinaJelfs];
  $scope.contact = function(member){
    $location.path("/contact/" + member.flag);  
  }
}

function LoginCtrl($scope, $http, authService) {
  $scope.flippy = function(){
     $("#login-reg").toggleClass("flipped"); 
  }
  $scope.submit = function() {
    $http.post('/api/login', {
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }
  $scope.register = function() {
    $http.post('/api/register', {
      name : $scope.name,
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }
}

function VolunteerCtrl($scope, $http, $location, timeParsing, event){
  $scope.currentVolunteer = null;
  $scope.event = event;
  var currentSlot;
  
  $scope.timeSlotsArray = timeParsing.slotsArray($scope.event.timeSlots, $scope.event.slotDuration, $scope.event.start);
  
  $scope.volunteer = function(task, slot){
    $('#confirm').foundation('reveal', 'open');
    currentSlot = slot;
  }
  $scope.submitVolunteer = function(){
    $scope.currentVolunteer.index = currentSlot.volunteers.length;
    currentSlot.volunteers.push($scope.currentVolunteer);   
    $http.post("/api/event/edit/" + $scope.event._id, {
      event: $scope.event
    }).success(function (result) {
      $scope.cancel();
      $scope.currentVolunteer = {};
      $scope.form.$setPristine();
    });                
  }
  $scope.cancel = function(){
    $('#confirm').foundation('reveal', 'close');
    $scope.currentVolunteer = {};
    $scope.form.$setPristine();
  }
  $scope.removeVolunteer = function(slot, volunteer){
    var i = slot.volunteers.indexOf(volunteer);
    if(i >= 0){
      slot.volunteers.splice(i,1);  
    }
    $http.post("/api/event/edit/" + $scope.event._id, { event: $scope.event });
  }  
}

function NewsItemCtrl($scope, $http, $location, newsitem){
  $scope.viewTitle = newsitem == null ? "Create a news item" : "Update news item";
  $scope.buttonText = newsitem == null ? "Create" : "Update";
  var creating = newsitem == null;
  
  $scope.newsitem = newsitem || {
    date : new Date(),
    author : 'Julian'
  }; 
  
    $scope.submit = function () {
      var url = newsitem == null ? '/api/newsitem/create' : "/api/newsitem/edit/" + $scope.newsitem._id;
      $http.post(url, {
        newsitem: $scope.newsitem
      }).success(function (result) {
        $location.path("/newsitem/index");
      });
    }
    
    $scope.delete = function () {
      if(creating){
        $location.path("/newsitem/index");
      } else {
        $http.post("/api/newsitem/delete/" + $scope.newsitem._id).success(function (result) {
          $location.path("/newsitem/index");
        });
      }
    }
}

function EventCtrl($scope, $http, $location, timeParsing, event){
  $scope.viewTitle = event == null ? "Create a new event" : "Update event";
  $scope.buttonText = event == null ? "Create" : "Update";
  $scope.event = event || {
    tasks : [],
    slotDuration : 60,
    timeSlots : 0
  };
  
  $scope.timeSlotsArray = [];
  
  function buildTimeSlotsArray(slots){
    $scope.timeSlotsArray = timeParsing.slotsArray(slots, parseInt($scope.event.slotDuration), $scope.event.start);
  }
  
  $scope.$watch('event.timeSlots', function(val){
    buildTimeSlotsArray(val);  
    rejigSlots(val);
  });
  
  $scope.$watch('event.slotDuration', function(val){
    buildTimeSlotsArray($scope.event.timeSlots);  
    rejigSlots($scope.event.timeSlots);
  });
  
  $scope.$watch('event.start', function(val){
    buildTimeSlotsArray($scope.event.timeSlots);  
    rejigSlots($scope.event.timeSlots);
  });
  
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
  
  function rejigSlots(slots){
    //go through all tasks in the event and make sure we have the right number of slots. 
    angular.forEach($scope.event.tasks, function(val, key){
      
      if(val.slots.length < slots){
        val.slots.push({
          index : val.slots.length,
          required : 0,
          volunteers :[]
        });    
      }
      if(val.slots.length > slots){
        val.slots.splice(val.slots.length-1,1);
      }
    });
  }
  
  $scope.submit = function(){
      var url = event == null ? '/api/event/create' : "/api/event/edit/" + $scope.event._id;
      $http.post(url, {
        event: $scope.event
      }).success(function (result) {
        $location.path("/event/index");
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
