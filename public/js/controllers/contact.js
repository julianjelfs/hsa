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
  
  $scope.noRecipients = function(){
    return $scope.to.length === 0;
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