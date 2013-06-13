'use strict';

/* Controllers */
function AppCtrl($scope, $location, $http) {

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
            circle : $scope.newsitem
        }).success(function(data, status, headers, config) {
            $location.path('/newsitem/index');
        });
    }
}

function NewEventCtrl($scope, $http, $location){
    $scope.submit = function(){
        $http.post('/api/event/create', {
            request : $scope.event
        }).success(function(data, status, headers, config) {
            $location.path('/event/index');
        });
    }
}

function HomeCtrl($scope, $timeout, $window){
  $scope.$on("$viewContentLoaded", function(){
    
  }); 
  
}
