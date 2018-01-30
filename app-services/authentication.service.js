(function() {
  'use strict';

  angular
    .module('ShopDBAdmin')
    .factory('AuthenticationService', Service);

  function Service($q, $http, $rootScope, $localStorage, $location, jwtHelper, apiurl) {
    var service = {};

    service.Login = Login;
    service.Logout = Logout;
    service.Status = Status;
    service.Subscribe = Subscribe;
    service.UpdateLoginState = UpdateLoginState;

    return service;

    function Subscribe(scope, callback) {
      var handler = $rootScope.$on('notifying-service-event', function() {
        var token = $localStorage.token;
        callback((typeof(token) !== "undefined" && token));
      });
      scope.$on('$destroy', handler);
    }

    function UpdateLoginState() {
      $rootScope.$emit('notifying-service-event');
    }

    function Login(email, password, callback) {
      return $http.post(apiurl + "/login", {
          email: email,
          password: password
        })
        .then(function(response) {
            if (response.data.result) {
              $localStorage.token = response.data.token;
              $localStorage.admin = response.data.admin;
              UpdateLoginState();
              return $q.resolve();
            } else {
              $localStorage.token = null;
              $localStorage.admin = null;
              UpdateLoginState();
              return $q.reject();
            }
          });
    }

    function Status(callback) {
      $http.get(apiurl + "/status", {})
        .then(function(response) {
            if (response.data.result) {
              callback(true);
            } else {
              callback(false);
            }
          },
          function(data) {
            callback(false);
          });
    }

    function Logout() {
      delete $localStorage.token;
      delete $localStorage.admin;
      UpdateLoginState();
      $location.path('/login');
    }
  }
})();
