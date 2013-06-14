'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('truncate', function() {
    return function(input, limit) {
      return input.substring(0, limit) + "...";
    }
  });
