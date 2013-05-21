'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {templateUrl: 'partials/account/login', controller: LoginCtrl});
    $routeProvider.when('/register', {templateUrl: 'partials/account/register', controller: RegisterCtrl});
    $routeProvider.when('/request/new', {templateUrl: 'partials/request/new', controller: RequestCtrl});
    $routeProvider.when('/request/index', {templateUrl: 'partials/request/index', controller: RequestCtrl});
    $routeProvider.when('/circle/index', {templateUrl: 'partials/circle/index', controller: CircleCtrl});
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);