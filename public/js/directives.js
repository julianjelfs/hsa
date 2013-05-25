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
  var up = 38, down = 40;
  
  return {
    restrict : 'E',
    replace : true,
    templateUrl : 'partials/account/userlookup',
    link : function(scope, elem, attrs){
      var selectedIndex = 0;
      var inp = angular.element("input.user-lookup-input", elem);
      var result = angular.element("div.lookup-result", elem);
      result.css('top', inp.position().top + inp.outerHeight());
      
      inp.keydown(function(e){
        scope.$apply(function(){
          if(e.which == down){
            selectedIndex += 1; 
            e.preventDefault();
          }
          if(e.which == up){
            selectedIndex -= 1;   
            e.preventDefault();
          }
        });
      }).blur(function(){
        scope.$apply(function(){
          scope.results = [];
        });
      });
      
      scope.class = function(index){
        return index == selectedIndex ? "entry active" : "entry"; 
      }
      
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
