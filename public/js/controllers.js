'use strict';

/* Controllers */

function AppCtrl($scope, $location, $http) {
  $scope.logout = function(){
    $http.post('/api/logout').success(function(data, status, headers, config) {
      $location.path("/");
    });      
  }
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

function RequestCtrl($scope, $http) {
  $http.get('/api/requests').success(function(data, status, headers, config) {
    $scope.requests = data;  
  });
}

function CircleCtrl() {
  
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
