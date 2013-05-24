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


function RegisterCtrl($scope, $http, authService) {
  $scope.submit = function() {
    $http.post('/api/register', {
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }  
}

function RequestCtrl($scope, $http, requests) {
  $scope.requests = requests;
}

function CircleCtrl($scope, circles) {
    $scope.circles = circles;
}

function NewCircleCtrl($scope, $http, $location){
    $scope.submit = function(){
        $http.post('/api/circle/create', {
            name : $scope.name,
            description : $scope.description
        }).success(function(data, status, headers, config) {
            $location.path('/circle/index');
        });
    }
}

function NewRequestCtrl($scope, $http, $location){
    $scope.submit = function(){
        $http.post('/api/request/create', {
            request : $scope.request
        }).success(function(data, status, headers, config) {
            $location.path('/request/index');
        });
    }
}

function HomeCtrl($scope, $timeout, $window){
  $scope.$on("$viewContentLoaded", function(){
    $timeout(function(){
      $('.orbit-container').foundation('orbit', {
        timer_speed: 3000,
        animation_speed: 300,
        bullets: false,
        stack_on_small: true,
        container_class: 'orbit-container',
        stack_on_small_class: 'orbit-stack-on-small',
        next_class: 'orbit-next',
        prev_class: 'orbit-prev',
        timer_container_class: 'orbit-timer',
        timer_paused_class: 'paused',
        timer_progress_class: 'orbit-progress',
        slides_container_class: 'orbit-slides-container',
        bullets_container_class: 'orbit-bullets',
        bullets_active_class: 'active',
        slide_number_class: 'orbit-slide-number',
        caption_class: 'orbit-caption',
        active_slide_class: 'active',
        orbit_transition_class: 'orbit-transitioning'
      });
    }, 150);
  }); 
  
}
