'use strict';

angular.module('myApp')
.controller('AppCtrl', ["$rootScope", "$scope", "$timeout", "$location", function($rootScope, $scope, $timeout, $location){
  $rootScope.$on('event:error-response', function(){
    $timeout(function(){
      $('#error').foundation('reveal', 'open');    
    }, 0);
  });
  $scope.dismissError = function(){
    $('#error').foundation('reveal', 'close');
    $location.path("/");
  }
}]);