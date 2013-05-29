'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['http-auth-interceptor', 'myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home/index', controller: HomeCtrl});
        $routeProvider.when('/login', {templateUrl: 'partials/account/login', controller: LoginCtrl});

        $routeProvider.when('/logout', {
            templateUrl: 'partials/account/login',
            controller: function ($location, logout) {
                $location.path("/");
            },
            resolve: {
                logout: function ($q, $http) {
                    var def = $q.defer();

                    $http.post('/api/logout').success(function (data, status) {
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
            controller: function ($scope, $routeParams, $http, request) {
                $scope.requests = request;
                $scope.delete = function (c) {
                    var i = $scope.requests.indexOf(c)
                    $http.post("/api/request/delete/" + c._id).success(function (result) {
                        $scope.requests.splice(i, 1);
                    });
                }
            },
            resolve : getResolver('request')
        });

        $routeProvider.when('/circle/index', {
            templateUrl: 'partials/circle/index',
            controller: function ($scope, $http, circle) {
                $scope.circles = circle;
                $scope.delete = function (c) {
                    var i = $scope.circles.indexOf(c)
                    $http.post("/api/circle/delete/" + c._id).success(function (result) {
                        $scope.circles.splice(i, 1);
                    });
                }
            },
            resolve : getResolver('circle')
        });

        function getResolver(name){
            var r = {};
            r[name] = function ($q, $route, $timeout, $http) {
                var deferred = $q.defer();
                $http.get('/api/' + name).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            return r;
        }

        $routeProvider.when('/circle/edit/:id', {
            templateUrl: 'partials/circle/edit',
            controller: function ($scope, $http, $location, circle) {
                $scope.circle = circle;
                $scope.submit = function () {
                    $http.post("/api/circle/edit/" + $scope.circle._id, {
                        circle: $scope.circle
                    }).success(function (result) {
                            $location.path("/circle/index");
                        });
                }
                $scope.addUser = function(user){
                  if($scope.circle.users == null){
                    $scope.circle.users = [];
                  }
                  $scope.circle.users.push(user);
                }
            },
            resolve: {
                circle: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/circle/' + id).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            }
        });

        $routeProvider.when('/request/edit/:id', {
            templateUrl: 'partials/request/edit',
            controller: function ($scope, $http, $location, request) {
                $scope.request = request;
                $scope.submit = function () {
                    $http.post("/api/request/edit/" + $scope.request._id, {
                        request: $scope.request
                    }).success(function (result) {
                        $location.path("/request/index");
                    });
                }
            },
            resolve: {
                request: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/request/' + id).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }
            }
        });

        $routeProvider.when('/circle/new', {templateUrl: 'partials/circle/new', controller: NewCircleCtrl});
        $routeProvider.when('/request/new', {templateUrl: 'partials/request/new', controller: NewRequestCtrl});

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);