'use strict';
angular.module('myApp')
  .controller('TeamCtrl', ["$scope", "$location", "contact", function ($scope, $location, contact){
  $scope.team = [contact.NickyGray,contact.KarenWright, contact.KallinaJelfs];
  $scope.contact = function(member){
    $location.path("/contact/" + member.flag);  
  }
}]);