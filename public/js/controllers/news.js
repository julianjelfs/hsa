'use strict';
angular.module('myApp')
  .controller('NewsItemCtrl', ["$scope", "$http", "$location", "newsitem", function ($scope, $http, $location, newsitem){
  $scope.viewTitle = newsitem == null ? "Create a news item" : "Update news item";
  $scope.buttonText = newsitem == null ? "Create" : "Update";
  var creating = newsitem == null;
  $scope.newsitem = newsitem || {
    date : new Date(),
    author : 'Julian'
  }; 
  
    $scope.submit = function () {
      var url = newsitem == null ? '/api/newsitem/create' : "/api/newsitem/edit/" + $scope.newsitem._id;
      $http.post(url, {
        newsitem: $scope.newsitem
      }).success(function (result) {
        $location.path("/newsitem/index");
      });
    }
    
    $scope.delete = function () {
      if(creating){
        $location.path("/newsitem/index");
      } else {
        $http.post("/api/newsitem/delete/" + $scope.newsitem._id).success(function (result) {
          $location.path("/newsitem/index");
        });
      }
    }
}]);