'use strict';

/* Directives */


angular.module('myApp')
  .directive('hsaApp', function() {
    return {
      restrict: 'C',
      link: function(scope, elem, attrs) {
        elem.removeClass('waiting-for-angular');

        var login = angular.element("#login-holder");
        var main = angular.element('#content');
        
        login.hide();
        
        scope.$on('event:auth-loginRequired', function() {
          login.show();
          main.hide();
        });

        scope.$on('event:auth-loginConfirmed', function(e, data) {
          scope.$root.user = data;
          main.show();
          login.hide();
        });
        
        scope.$on('event:auth-loginCancelled', function() {
          main.show();
          login.hide();
        });
      }
    }
  })
.directive("navbar", ["$cookies", function($cookies){
  return {
    restrict : "E",
    replace : true,
    templateUrl : "partials/home/nav",
    link : function (scope, elem, attrs) {
      scope.loggedIn = function(){
        return scope.user != null;
      }
      
      scope.logIn = function(){
        scope.$broadcast('event:auth-loginRequired');
      }
      
      scope.$on('event:auth-loginConfirmed', function(e, data) {
        scope.user = data;
      });
    }
  }
}])
.directive("pager", function(){
  return {
    restrict : "E",
    replace : true,
    template : "<div class='pagination-centered'><ul class='pagination'></ul></div>",
    link : function(scope, elem, attrs) {
      
      function nextPage(){
        return scope.page < scope.pages-1 ? scope.page+1 : scope.page;
      }
      
      function prevPage(){
        return scope.page > 0 ? scope.page-1 : 0;
      }
      
      var ul = $("ul", elem);
      $("<li class='arrow "+ (scope.page == 0 ? "unavailable" : "") +"'><a href='/"+ attrs.model +"/index/"+ prevPage() +"'>&laquo;</a></li>").appendTo(ul);
      for(var i=0; i<scope.pages; i++){
        $("<li "+ (scope.page == i ? "class='current'" : "") +"><a href='/"+ attrs.model +"/index/"+ i +"'>"+ (i+1) +"</a></li>").appendTo(ul);  
      }
      $("<li class='arrow "+ (scope.page == scope.pages-1 ? "unavailable" : "") +"'><a href='/"+ attrs.model +"/index/"+ nextPage() +"'>&raquo;</a></li>").appendTo(ul);
    }
  }
})
.directive("breadcrumb", function(){
  return {
    restrict : "E",
    replace : "true",
    template : "<ul class='breadcrumbs'></ul>",
    link : function(scope, elem, attrs) {
      scope.$on("$routeChangeSuccess", function(ev, current, prev){
        var template = current.templateUrl;
        var path = [{
          name : 'home',
          href : '/'
        }];
        console.log(template);
        switch(template) {
          case 'partials/contact/index' : 
            path.push({name : "contact us"});
            break;
          case 'partials/sponsors/index' : 
            path.push({name : "sponsors"});
            break;
          case 'partials/links/index' : 
            path.push({name : "links"});
            break;
          case 'partials/help/index' : 
            path.push({name : "how to help"});
            break;
          case 'partials/team/index' : 
            path.push({name : "team"});
            break;
          case 'partials/event/index' : 
            path.push({name : "events"});
            break;
          case 'partials/event/volunteer' :
          case 'partials/event/view' :
          case 'partials/event/edit' :
          case 'partials/event/new' : 
            path.push({
              name : "events",
              href : "/event/index/0"
            });
            path.push({name : "event"});
            break;
          case 'partials/newsitem/index' : 
            path.push({name : "news"});
            break;
          case 'partials/newsitem/view' :
          case 'partials/newsitem/edit' :
          case 'partials/newsitem/new' :
            path.push({
              name : "news",
              href : "/newsitem/index/0"
            });
            path.push({name : "item"});
            break;
        }
        $("li", elem).remove();
        angular.forEach(path, function(val){
          $("<li "+ (val.href == null ? "class='current'" : "") +"><a href='"+ (val.href  == null ? "#" : val.href) +"'>" + val.name + "</a></li>").appendTo(elem);
        });
          
      });
    }
  }
})
.directive('userLookup', [ "$http", function($http){
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
}]);
