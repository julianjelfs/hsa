'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('truncate', function() {
    return function(input, limit) {
      return input.substring(0, limit) + "...";
    }
  }).
  filter('htmlifyLineBreaks', function() {
    return function(input) {
      return input.replace(/\n/g, '<br/>');
    }
  });
