'use strict';

angular.module('myApp', ['ngCookies', 'http-auth-interceptor'])
.config(['$httpProvider', function($httpProvider) {    
    $httpProvider.responseInterceptors.push(["$q", "$rootScope", function($q, $rootScope) {
      return function(promise) {
        return promise.then(function(response) {
          return response;
        }, function(response) {
          if (response.status !== 401) {  //this will be handled by the auth module
            $rootScope.$broadcast('event:error-response');
          }
          return $q.reject(response);
        });
      } 
    }]);
  }]);