function TeamCtrl($scope, $location, contact){
  $scope.team = [contact.NickyGray,contact.KarenWright, contact.KallinaJelfs];
  $scope.contact = function(member){
    $location.path("/contact/" + member.flag);  
  }
}