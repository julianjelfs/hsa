'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['http-auth-interceptor', 'myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: 'partials/home/index', controller: HomeCtrl});
    $routeProvider.when('/login', {templateUrl: 'partials/account/login', controller: LoginCtrl});

        $routeProvider.when('/logout', {
            templateUrl :'partials/account/login',
            controller: function($location, logout){
                $location.path("/");
            },
            resolve : {
                logout : function($q, $http){
                    var def = $q.defer();

                    $http.post('/api/logout').success(function(data, status) {
                        def.resolve();
                    });

                    return def.promise;
                }
            }
        });

        $routeProvider.when('/register', {templateUrl: 'partials/account/register', controller: RegisterCtrl});
        $routeProvider.when('/request/new', {templateUrl: 'partials/request/new', controller: RequestCtrl});

        $routeProvider.when('/request/index', {
            templateUrl: 'partials/request/index',
            controller: function($scope, $routeParams, requests){
                $scope.requests = requests;
            },
            resolve : {
                requests : function($q, $route, $timeout, $http){
                    var deferred = $q.defer();
                    //get any route params via $route.current.params object

                    $http.get('/api/requests').success(function(result){
                        if(angular.equals(result, [])){
                            deferred.reject("No rejects to load");
                        } else {
                            deferred.resolve(result);
                        }
                    });

                    return deferred.promise;

                }
            }
        });

        $routeProvider.when('/circle/index', {
            templateUrl: 'partials/circle/index',
            controller: function($scope, circles){
                $scope.circles = circles;
            },
            resolve : {
                circles : function($q, $route, $http){
                    var deferred = $q.defer();

                    $http.get('/api/circles').success(function(result){
                        if(angular.equals(result, [])){
                            deferred.reject("No circles to load");
                        } else {
                            deferred.resolve(result);
                        }
                    });

                    return deferred.promise;

                }
            }
        });

        $routeProvider.when('/circle/new', {templateUrl: 'partials/circle/new', controller: NewCircleCtrl});

    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);