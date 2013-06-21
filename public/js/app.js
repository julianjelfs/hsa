'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngCookies', 'http-auth-interceptor', 'myApp.filters', 'myApp.services', 'myApp.directives']).
    config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {templateUrl: 'partials/home/index', controller: HomeCtrl});
        $routeProvider.when('/login', {templateUrl: 'partials/account/login', controller: LoginCtrl});
        $routeProvider.when('/team', {templateUrl: 'partials/team/index', controller: TeamCtrl});
        $routeProvider.when('/help', {templateUrl: 'partials/help/index'});
      $routeProvider.when('/contact/:flag', {templateUrl: 'partials/contact/index', controller : ContactCtrl});
      $routeProvider.when('/contact', {templateUrl: 'partials/contact/index', controller : ContactCtrl});
      $routeProvider.when('/links', {templateUrl: 'partials/links/index'});
      $routeProvider.when('/sponsors', {templateUrl: 'partials/sponsors/index', controller : SponsorsCtrl});

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

      $routeProvider.when('/event/index/:page', {
            templateUrl: 'partials/event/index',
            controller: function ($scope, $http, $location, event, $routeParams) {
              $scope.page = parseInt($routeParams.page);    
              $scope.events = event.events;
              $scope.pages = Math.ceil(event.total / event.pageSize);
              $scope.pageSize = event.pageSize;
              
                $scope.delete = function (e) {
                    var i = $scope.events.indexOf(e)
                    $http.post("/api/event/delete/" + e._id).success(function (result) {
                        $scope.events.splice(i, 1);
                    });
                }                
                $scope.viewItem = function(item){
                  $location.path("/event/view/" + item._id);  
                }
                $scope.nextPage = function(){
                  return $scope.page + 1;
                }
            },
            resolve : getResolver('event')
        });

      $routeProvider.when('/newsitem/index/:page', {
            templateUrl: 'partials/newsitem/index',
            controller: function ($scope, $location, newsitem, $routeParams) {
              $scope.page = parseInt($routeParams.page);  
              $scope.newsitems = newsitem.items;
              $scope.pages = Math.ceil(newsitem.total / newsitem.pageSize);
              $scope.pageSize = newsitem.pageSize;
              
              $scope.viewItem = function(item){
                $location.path("/newsitem/view/" + item._id);  
              }
              $scope.nextPage = function(){
                return $scope.page + 1;
              }
            },
            resolve : getResolver('newsitem')
        });

        function getResolver(name){
            var r = {};
            r[name] = function ($q, $http, $route, $routeParams) {
              var deferred = $q.defer();
                $http.get('/api/' + name + "s/" + $route.current.params.page).success(function (result) {
                  deferred.resolve(result);
                }).error(function (error) {
                        deferred.reject(error);
                    });
                return deferred.promise;
            };
            return r;
        }
      
      function getNewsItemResolver(){
        return {
                newsitem: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/newsitem/' + id).success(function (result) {
                        deferred.resolve(result);
                    }).error(function (error) {
                            deferred.reject(error);
                        });

                    return deferred.promise;
                }
            };
      }
      
        $routeProvider.when('/newsitem/view/:id', {
            templateUrl: 'partials/newsitem/view',
            controller: NewsItemCtrl,
            resolve: getNewsItemResolver()
        });

        $routeProvider.when('/newsitem/edit/:id', {
            templateUrl: 'partials/newsitem/new',
            controller: NewsItemCtrl,
            resolve: getNewsItemResolver()
        });
      
      function getEventResolver(){
        return {
                event: function ($q, $route, $http) {
                    var deferred = $q.defer();
                    var id = $route.current.params.id

                    $http.get('/api/event/' + id).success(function (result) {
                      result.date = new Date(result.date);
                      deferred.resolve(result);
                    }).error(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }
            };
      }
      
      function nullResolver(name){
        var obj = {};
        obj[name] = function($q){
            var deferred = $q.defer();
            deferred.resolve(null);            
            return deferred.promise;
          };
        return obj;
      }

      $routeProvider.when('/event/view/:id', {
            templateUrl: 'partials/event/view',
            controller: VolunteerCtrl,
            resolve: getEventResolver()
        });
      
        $routeProvider.when('/event/edit/:id', {
          templateUrl: 'partials/event/new',
          controller: EventCtrl, 
          resolve: getEventResolver()
        });
      
      $routeProvider.when('/event/new', { 
        templateUrl: 'partials/event/new', 
        controller: EventCtrl, 
        resolve : nullResolver('event') 
      });

        $routeProvider.when('/newsitem/new', {
          templateUrl: 'partials/newsitem/new', 
          controller: NewsItemCtrl,
          resolve : nullResolver('newsitem')
        });
        
      $routeProvider.otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
    }]);