'use strict';

/* Controllers */

function AppCtrl($scope, $http) {
  $http({method: 'GET', url: '/api/name'}).
  success(function(data, status, headers, config) {
    $scope.name = data.name;
  }).
  error(function(data, status, headers, config) {
    $scope.name = 'Error!'
  });
}

function LoginCtrl() {

}


function RegisterCtrl() {

}

function RequestCtrl() {
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
