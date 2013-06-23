function LoginCtrl($rootScope, $scope, $http, $location, authService) {
  $scope.flippy = function(){
     $("#login-reg").toggleClass("flipped"); 
  }
  $scope.cancel = function(){
    $rootScope.$broadcast("event:auth-loginCancelled");
  }
  $scope.submit = function() {
    $http.post('/api/login', {
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }
  $scope.register = function() {
    $http.post('/api/register', {
      name : $scope.name,
      username : $scope.username,
      password : $scope.password
    }).success(function(data, status, headers, config) {
      authService.loginConfirmed(data);
    });
  }
  $scope.forgotPassword = function(){
    if(!$scope.loginForm.username.$valid) {
      return;
    }
    $http.post('/api/forgot', {
      username : $scope.username
    }).success(function() {
      alert('Password reset instructions have been sent to your account');
      $scope.cancel();
      $location.path("/");
    });
  }
}