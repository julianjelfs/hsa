'use strict';

/* Directives */


angular.module('myApp.directives', [])
  .directive('hsaApp', function() {
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
  var up = 38, down = 40, enter = 13, esc = 27;
  
  return {
    restrict : 'E',
    replace : true,
    templateUrl : 'partials/account/userlookup',
    scope : {
      selectItem : '&selectItem'
    },
    link : function(scope, elem, attrs){
      var selectedIndex = 0;
      var inp = angular.element("input.user-lookup-input", elem);
      var result = angular.element("div.lookup-result", elem);
      result.css('top', inp.position().top + inp.outerHeight());
      
      inp.keydown(function(e){
        scope.$apply(function(){
          if(e.which == down){
            selectedIndex = selectedIndex == scope.results.length-1 ? 0 : selectedIndex + 1; 
            e.preventDefault();
          }
          if(e.which == up){
            selectedIndex = selectedIndex == 0 ? scope.results.length-1 : selectedIndex - 1; 
            e.preventDefault();
          }
          if(e.which == enter){
            scope.selectItem({item : scope.results[selectedIndex]});
            scope.results = [];
            scope.prefix = '';
            e.preventDefault();  
          }
          if(e.which == esc){
            scope.results = [];
          }
        });
      });
      
      scope.mouseenter = function(index){
        selectedIndex = index;  
      }
      
      scope.clickUser = function(index){
        selectedIndex = index; 
        scope.selectItem({item : scope.results[selectedIndex]});
        scope.results = [];
        scope.prefix = '';
      }
      
      scope.class = function(index){
        return index == selectedIndex ? "entry active" : "entry"; 
      }
      
      scope.$watch('prefix', function(newVal, oldVal){
        if(newVal == null || newVal == ''){        
          scope.results = [];
          return;
        }
        $http.get("/api/search/users/" + newVal).success(function(data){
          selectedIndex = 0;
          scope.results = data;
        }).error(function(error){
          alert("user lookup went wrong: " + error);
        });
        
      });
    }
  }
});
