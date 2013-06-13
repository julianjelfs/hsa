'use strict';

/* Controllers */
function AppCtrl($scope, $location, $http) {

}

function TeamCtrl($scope){
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
    position : 'Chair Person',
    name : 'Nicky	Gray',
    phone : '07729 773 885'
  }]; 
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
    $scope.submit = function(){
        $http.post('/api/event/create', {
            event : $scope.event
        }).success(function(data, status, headers, config) {
            $location.path('/event/index');
        });
    }
}

function HomeCtrl($scope, $timeout, $window){
  $scope.$on("$viewContentLoaded", function(){
    
  }); 
  
}
