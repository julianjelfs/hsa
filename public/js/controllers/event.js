'use strict';
angular.module('myApp')
  .controller('EventCtrl', ["$rootScope", "$scope", "$http", "$location", "timeParsing", "event", function($rootScope, $scope, $http, $location, timeParsing, event){
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
        required : 1,
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
}]);