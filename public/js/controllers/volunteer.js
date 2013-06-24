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