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

        $routeProvider.when('/newsitem/index', {
            templateUrl: 'partials/newsitem/index',
            controller: function ($scope, $http, newsitem) {
                $scope.newsitems = newsitems;
                $scope.delete = function (n) {
                    var i = $scope.newsitems.indexOf(n)
                    $http.post("/api/newsitem/delete/" + n._id).success(function (result) {
                        $scope.newsitems.splice(i, 1);
                    });
                }
            },
            resolve : getResolver('newsitem')
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

        $routeProvider.when('/newsitems/edit/:id', {
            templateUrl: 'partials/newsitem/edit',
            controller: function ($scope, $http, $location, newsitem) {
                $scope.newsitem = newsitem;
                $scope.submit = function () {
                    $http.post("/api/newsitem/edit/" + $scope.newsitem._id, {
                        circle: $scope.newsitem
                    }).success(function (result) {
                            $location.path("/newsitem/index");
                        });
                }
            },
            resolve: {
                circle: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/newsitem/' + id).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            }
        });

        $routeProvider.when('/event/edit/:id', {
            templateUrl: 'partials/event/edit',
            controller: function ($scope, $http, $location, event) {
                $scope.event = event;
                $scope.submit = function () {
                    $http.post("/api/event/edit/" + $scope.event._id, {
                        event: $scope.event
                    }).success(function (result) {
                        $location.path("/event/index");
                    });
                }
            },
            resolve: {
                request: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/event/' + id).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }
            }
        });

        $routeProvider.when('/newsitem/new', {templateUrl: 'partials/newsitem/new', controller: NewNewsItemCtrl});
        $routeProvider.when('/event/new', {templateUrl: 'partials/event/new', controller: NewEventCtrl});

        $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);