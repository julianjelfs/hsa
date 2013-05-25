'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('helpmegooutApp', function() {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        elem.removeClass('waiting-for-angular');

        var login = angular.element("#login-holder");
        var main = angular.element('#content');
        
        login.hide();
        
        scope.$on('event:auth-loginRequired', function() {
          login.slideDown('fast', function() {
            main.hide();
          });
        });

        scope.$on('event:auth-loginConfirmed', function() {
          main.show();
          login.slideUp('fast');
        });
      }
    }
  })
.directive('userLookup', function($http){
  return {
    restrict : 'E',
    replace : true,
    templateUrl : 'partials/account/userlookup',
    link : function(scope, elem, attrs){
      scope.$watch('prefix', function(newVal, oldVal){
        if(newVal == null || newVal == ''){        
          scope.results = [];
          return;
        }
        $http.get("/api/search/users/" + newVal).success(function(data){
          scope.results = data;
        }).error(function(error){
          alert("user lookup went wrong: " + error);
        });
        
      });
    }
  }
});
